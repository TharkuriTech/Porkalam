import React, { useEffect, useState } from 'react';
import '../../Styles/Auth.css';
import apiClient from '../../api/apiClient.ts';

interface RegisterForm {
    fullName: string;
    fatherName: string;
    dateOfBirth: string;
    gender: 'M' | 'F' | 'O';
    password: string;
    email: string;
    mobileNumber: string;
    constituencyId: number;
    stateId: number;
    countryId: number;
}

const Register: React.FC = () => {
    const [form, setForm] = useState<RegisterForm>({
        fullName: '',
        fatherName: '',
        dateOfBirth: '',
        gender: 'M',
        password: '',
        email: '',
        mobileNumber: '',
        constituencyId: 0,
        stateId: 0,
        countryId: 0,
    });

    const comboDataList = [
        "Country",
        "State",
        "Constituency"
    ];

    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [comboData, setComboData] = useState({
        Country: [],
        State: [],
        Constituency: []
    });
    const [filteredStates, setFilteredStates] = useState<any[]>([]);
    const [filteredConstituencies, setFilteredConstituencies] = useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name.includes('Id') ? Number(value) : value,
        }));
    };

    useEffect(() => {
        getComboData();
    }, []);

    useEffect(() => {
        if (form.countryId) {
            const states = comboData.State.filter(
                (s: any) => s.parentLookupId === form.countryId
            );
            setFilteredStates(states);
        } else {
            setFilteredStates([]);
        }

        setForm(prev => ({
            ...prev,
            stateId: 0,
            constituencyId: 0
        }));
        setFilteredConstituencies([]);
    }, [form.countryId]);

    useEffect(() => {
        if (form.stateId) {
            const constituencies = comboData.Constituency.filter(
                (c: any) => c.parentLookupId === form.stateId
            );
            setFilteredConstituencies(constituencies);
        } else {
            setFilteredConstituencies([]);
        }

        setForm(prev => ({
            ...prev,
            constituencyId: 0
        }));
    }, [form.stateId]);

    const getComboData = async () => {
        try {
            const response = await apiClient.post(`/Lookup/getComboData`, comboDataList);
            setComboData(response.data);
        }
        catch (error) {
            console.error(`Failed to fetch ${comboDataList} data:`, error);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setResponseMessage('');
        setLoading(true);

        try {
            const payload = {
                fullName: form.fullName,
                fatherName: form.fatherName,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                password: form.password,
                email: form.email,
                mobileNumber: form.mobileNumber,
                constituencyId: form.constituencyId,
                stateId: form.stateId,
                countryId: form.countryId,
            };

            const response = await apiClient.post('/Auth/register', payload);
            setResponseMessage(response.data.message);
            if (response.data.isSuccess) {
                setForm({
                    fullName: '',
                    fatherName: '',
                    dateOfBirth: '',
                    gender: 'M',
                    password: '',
                    email: '',
                    mobileNumber: '',
                    constituencyId: 0,
                    stateId: 0,
                    countryId: 0,
                });
            }
        } catch (error) {
            //   console.error('Register failed:', error);
            setResponseMessage('Registration failed. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-body">
            <div className="auth-container w-100">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Register to access your dashboard</p>
                    </div>

                    {responseMessage && (
                        <div className={`response-message ${responseMessage.includes('successful') ? 'response-success' : 'response-error'}`}>
                            {responseMessage}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className='reg-form full-width'>
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder=''
                                    />
                                    <label>Full Name</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={form.fatherName}
                                        onChange={handleChange}
                                        required
                                        placeholder=''
                                    />
                                    <label>Father Name</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={form.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                        placeholder=''
                                    />
                                    <label>Date of Birth</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <select name="gender" value={form.gender} onChange={handleChange} required>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                    <label>Gender</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        placeholder=''
                                    />
                                    <label>Password</label>
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder=''
                                    />
                                    <label>Email Address</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        value={form.mobileNumber}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{10}"
                                        placeholder="1234567890"
                                    />
                                    <label>Mobile Number</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <select
                                        name="countryId"
                                        value={form.countryId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        {comboData.Country.map((c: any) => (
                                            <option key={c.lookupId} value={c.lookupId}>
                                                {c.value}
                                            </option>
                                        ))}
                                    </select>
                                    <label>Country</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <select
                                        name="stateId"
                                        value={form.stateId}
                                        onChange={handleChange}
                                        required
                                        disabled={!form.countryId}
                                        title={!form.countryId ? "Please select a country first" : ""}
                                    >
                                        <option value="">Select State</option>
                                        {filteredStates.map((s: any) => (
                                            <option key={s.lookupId} value={s.lookupId}>
                                                {s.value}
                                            </option>
                                        ))}
                                    </select>
                                    <label>State</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <select
                                        name="constituencyId"
                                        value={form.constituencyId}
                                        onChange={handleChange}
                                        required
                                        disabled={!form.stateId}
                                        title={!form.stateId ? "Please select a State first" : ""}

                                    >
                                        <option value="">Select Constituency</option>
                                        {filteredConstituencies.map((c: any) => (
                                            <option key={c.lookupId} value={c.lookupId}>
                                                {c.value}
                                            </option>
                                        ))}
                                    </select>
                                    <label>Constituency</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className={`btn auth-btn ${loading ? 'loading' : ''}`}>
                            <span className="btn-text">Register</span>
                            <span className="btn-loader"></span>
                        </button>

                        <div className="signup-link">
                            <p>
                                Already have an account? <a href="/">Sign in</a>
                            </p>
                        </div>
                    </form>
                </div >
            </div >
        </div>
    );
};

export default Register;
