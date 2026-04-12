import { useEffect, useState } from "react";
import apiClient from "../api/apiClient.ts";
import { ICandidate } from "../Util/Util.ts";
import Loader from "../Components/Loader.tsx";

const Candidates: React.FC = () => {
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [filtered, setFiltered] = useState<ICandidate[]>([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof ICandidate>("name");
    const [sortAsc, setSortAsc] = useState(true);
    const [selectedParty, setSelectedParty] = useState(0);
    const [selectedConstituency, setSelectedConstituency] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [hasSearchStarted, setHasSearchStarted] = useState(false);
    const comboDataList = [
        "Party",
        "Constituency"
    ];
    const [comboData, setComboData] = useState({
        Party: [],
        Constituency: []
    });

    const getComboData = async () => {
        setPageLoading(true);
        try {
            const response = await apiClient.post(`/Lookup/getComboData`, comboDataList);
            setComboData(response.data);
        }
        catch (error) {
            console.error(`Failed to fetch ${comboDataList} data:`, error);
        } finally {
            setPageLoading(false);
        }
    };

    const getCandidates = async () => {
        if (!selectedParty && !selectedConstituency) {
            return;
        }
        setIsLoading(true);
        try {
            const params = {
                partyId: selectedParty,
                constituencyId: selectedConstituency
            }
            const res = await apiClient.post("/Home/get-candidates", params);
            // 🧑‍💼 Candidates
            const mappedCandidates = res.data.map((c: any) => ({
                candidateId: c.candidateId,
                name: c.candidateName,
                description: c.description,
                image: c.profileImageUrl,
                isIndependent: c.isIndependent,
                constituency: c.constituency,
                partyName: c.partyName,
                partyShortName: c.partyShortName,
                partyLogo: c.logoUrl,
                symbol: c.symbolUrl
            }));
            const data: ICandidate[] = mappedCandidates;

            setCandidates(data);
            setFiltered(data);
        } finally {
            setIsLoading(false);
            setHasSearchStarted(true);
        }
    };

    useEffect(() => {
        getComboData();
    }, []);

    useEffect(() => {
        let data = [...candidates];

        // 🔍 Search
        if (search) {
            data = data.filter(c =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.partyShortName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 🔃 Sorting
        data.sort((a, b) => {
            const valA = (a[sortField] || "").toString().toLowerCase();
            const valB = (b[sortField] || "").toString().toLowerCase();

            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });

        setFiltered(data);
    }, [search, selectedParty, candidates, sortField, sortAsc]);

    if (pageLoading || isLoading) {
        return <Loader />;
    }

    const handleSort = (field: keyof ICandidate) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const getSortIcon = (field: keyof ICandidate) => {
        if (sortField !== field) return "↑↓";
        return sortAsc ? "↑" : "↓";
    };

    return (
        <div className="p-4">

            <div className="mb-4 flex flex-col md:flex-row gap-3">

                {/* 🔍 Search */}
                <input
                    type="text"
                    placeholder="Search candidate..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full md:w-64"
                />

                {/* 🎯 Party Filter */}
                <select
                    value={selectedParty}
                    onChange={(e) => {
                        setSelectedParty(+e.target.value);
                    }}
                    className="border border-gray-300 bg-white px-3 py-2 rounded-lg w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Party</option>
                    {comboData.Party.map((p: any) => (
                        <option key={'party' + p.lookupId} value={p.lookupId}>
                            {p.value}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedConstituency}
                    onChange={(e) => {
                        setSelectedConstituency(+e.target.value);
                    }}
                    className="border border-gray-300 bg-white px-3 py-2 rounded-lg w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Constituency</option>
                    {comboData.Constituency.map((c: any) => (
                        <option key={'constituency' + c.lookupId} value={c.lookupId}>
                            {c.value}
                        </option>
                    ))}
                </select>

                <button
                    onClick={getCandidates}
                    disabled={!selectedParty && !selectedConstituency}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg disabled:bg-gray-300 disabled:text-gray-600"
                >
                    {isLoading ? "Loading..." : "Search"}
                </button>

                <button
                    onClick={() => {
                        setSearch("");
                        setSelectedParty(0);
                        setSelectedConstituency(0);
                        setCandidates([]);
                        setFiltered([]);
                        setHasSearchStarted(false);
                    }}
                    className="bg-gray-200 px-3 py-2 rounded-lg"
                >
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="min-w-full text-sm text-left">

                    {/* Header */}
                    <thead className="bg-gray-100 uppercase text-xs">
                        <tr>

                            <th className="p-3 cursor-pointer" onClick={() => handleSort("name")}>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    Name <span>{getSortIcon("name")}</span>
                                </div>
                            </th>

                            <th className="p-3">Image</th>

                            <th className="p-3 cursor-pointer" onClick={() => handleSort("partyShortName")}>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    Party {getSortIcon("partyShortName")}
                                </div>
                            </th>

                            <th className="p-3 cursor-pointer" onClick={() => handleSort("constituency")}>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    Constituency {getSortIcon("constituency")}
                                </div>
                            </th>

                            <th className="p-3">Logo</th>

                            <th className="p-3">Symbol</th>

                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length > 0 ? (filtered.map(c => (
                            <tr key={c.candidateId} className="border-t hover:bg-gray-50">

                                <td className="p-3 font-medium">
                                    <a href={c.description} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {c.name}
                                    </a>
                                </td>
                                <td className="p-3">
                                    <img src={c.image} className="w-10 h-10 object-cover rounded-full" />
                                </td>

                                <td className="p-3">
                                    {c.partyShortName}
                                </td>

                                <td className="p-3">
                                    {c.constituency}
                                </td>

                                <td className="p-3">
                                    <img src={c.partyLogo} className="w-10 h-10 object-contain" />
                                </td>

                                <td className="p-3">
                                    <img src={c.symbol} className="w-10 h-10 object-contain" />
                                </td>
                            </tr>
                        ))) : (
                            <tr>
                                <td colSpan={6} className="p-3 text-center text-gray-500">
                                    {hasSearchStarted
                                        ? "No candidates found."
                                        : "Select a party or constituency and click Search to view candidates."
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Candidates;