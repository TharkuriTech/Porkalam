import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData, getUserData, clearUserData, setUserData } from "../Util/Util.ts";
import apiClient from "../api/apiClient.ts";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [loading, setLoading] = useState(false);

  const comboDataList = [
    "Country",
    "State",
    "Constituency"
  ];
  const [comboData, setComboData] = useState({
    Country: [],
    State: [],
    Constituency: []
  });
  const [filteredStates, setFilteredStates] = useState<any[]>([]);
  const [filteredConstituencies, setFilteredConstituencies] = useState<any[]>([]);

  const getComboData = async () => {
    try {
      const response = await apiClient.post(`/Lookup/getComboData`, comboDataList);
      setComboData(response.data);
    }
    catch (error) {
      console.error(`Failed to fetch ${comboDataList} data:`, error);
    }
  };

  useEffect(() => {
    const userData = getUserData();

    if (userData) {
      setUser(userData);
      setFormData(userData);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    getComboData();
  }, []);

  // Filter states based on country - only filter, don't reset values
  useEffect(() => {
    if (formData?.countryId && comboData.State.length > 0) {
      const states = comboData.State.filter(
        (s: any) => s.parentLookupId === formData.countryId
      );
      setFilteredStates(states);
    } else if (!formData?.countryId) {
      setFilteredStates([]);
    }
  }, [formData?.countryId, comboData.State]);

  // Filter constituencies based on state - only filter, don't reset values
  useEffect(() => {
    if (formData?.stateId && comboData.Constituency.length > 0) {
      const constituencies = comboData.Constituency.filter(
        (c: any) => c.parentLookupId === formData.stateId
      );
      setFilteredConstituencies(constituencies);
    } else if (!formData?.stateId) {
      setFilteredConstituencies([]);
    }
  }, [formData?.stateId, comboData.Constituency]);

  const handleLogout = () => {
    clearUserData();
    navigate("/");
  };

  const handleEditChange = (field: string, value: string | number) => {
    let updatedData = { ...formData };

    if (field === 'countryId') {
      const country = comboData.Country.find((c: any) => c.lookupId === Number(value));
      updatedData = {
        ...updatedData,
        countryId: Number(value),
        country: country ? country.value : "",
        stateId: 0,
        state: "",
        constituencyId: 0,
        constituency: ""
      };
    } else if (field === 'stateId') {
      const state = filteredStates.find((s: any) => s.lookupId === Number(value));
      updatedData = {
        ...updatedData,
        stateId: Number(value),
        state: state ? state.value : "",
        constituencyId: 0,
        constituency: ""
      };
    } else if (field === 'constituencyId') {
      const constituency = filteredConstituencies.find((c: any) => c.lookupId === Number(value));
      updatedData = {
        ...updatedData,
        constituencyId: Number(value),
        constituency: constituency ? constituency.value : ""
      };
    } else {
      updatedData = {
        ...updatedData,
        [field]: value
      };
    }

    setFormData(updatedData);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/User/save-user`, formData);
      if (response.data) {
        const updatedUser = { ...user, ...formData } as UserData;
        setUser(updatedUser);
        setUserData(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(user || {});
    setIsEditing(false);
  };

  if (!user) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 px-4 py-6 flex justify-center">

      <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-6">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-2xl font-semibold text-blue-600">
            {(formData?.fullName || user?.fullName || "").charAt(0)}
          </div>

          <h2 className="text-xl font-semibold mt-3">
            {formData?.fullName || user?.fullName}
          </h2>

          <p className="text-gray-500">@{user?.userName}</p>

          <p className={`mt-2 text-sm font-medium ${user?.isVerified ? "text-green-600" : "text-red-500"}`}>
            {user?.isVerified ? "✅ Verified" : "❌ Not Verified"}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-sm">

          {/* Personal Info */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Personal Information</h3>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData?.fullName || ""}
                    onChange={(e) => handleEditChange("fullName", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Father Name</label>
                  <input
                    type="text"
                    value={formData?.fatherName || ""}
                    onChange={(e) => handleEditChange("fatherName", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData?.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleEditChange("dateOfBirth", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Gender</label>
                  <select
                    value={formData?.gender || ""}
                    onChange={(e) => handleEditChange("gender", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="text-gray-500">Full Name:</span> <span className="font-medium">{user?.fullName}</span></div>
                <div><span className="text-gray-500">Father Name:</span> <span className="font-medium">{user?.fatherName}</span></div>
                <div><span className="text-gray-500">Date of Birth:</span> <span className="font-medium">{formatDate(user?.dateOfBirth || "")}</span></div>
                <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{user?.gender == "M" ? "Male" : user?.gender == "F" ? "Female" : "Other"}</span></div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Contact Information</h3>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData?.email || ""}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData?.mobileNumber || ""}
                    onChange={(e) => handleEditChange("mobileNumber", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{user?.email}</span></div>
                <div><span className="text-gray-500">Mobile:</span> <span className="font-medium">{user?.mobileNumber}</span></div>
              </div>
            )}
          </div>

          {/* Location Info */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">Location</h3>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1">Country</label>
                  <select
                    value={formData?.countryId || ""}
                    onChange={(e) => handleEditChange("countryId", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Select Country</option>
                    {comboData.Country.map((item: any) => (
                      <option key={item.lookupId} value={item.lookupId}>{item.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">State</label>
                  <select
                    value={formData?.stateId || ""}
                    onChange={(e) => handleEditChange("stateId", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    disabled={!formData?.countryId}
                    title={!formData?.countryId ? "Please select a country first" : ""}
                  >
                    <option value="">Select State</option>
                    {filteredStates.map((item: any) => (
                      <option key={item.lookupId} value={item.lookupId}>{item.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Constituency</label>
                  <select
                    value={formData?.constituencyId || ""}
                    onChange={(e) => handleEditChange("constituencyId", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    disabled={!formData?.stateId}
                    title={!formData?.stateId ? "Please select a state first" : ""}
                  >
                    <option value="">Select Constituency</option>
                    {filteredConstituencies.map((item: any) => (
                      <option key={item.lookupId} value={item.lookupId}>{item.value}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="text-gray-500">Country:</span> <span className="font-medium">{user?.country}</span></div>
                <div><span className="text-gray-500">State:</span> <span className="font-medium">{user?.state}</span></div>
                <div><span className="text-gray-500">Constituency:</span> <span className="font-medium">{user?.constituency}</span></div>
              </div>
            )}
          </div>

        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">

          {isEditing ? (
            <>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>

              <button
                onClick={handleCancel}
                disabled={loading}
                className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition disabled:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;