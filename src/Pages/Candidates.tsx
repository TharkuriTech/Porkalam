import { useEffect, useState } from "react";
import apiClient from "../api/apiClient.ts";

type Candidate = {
    candidateId: number;
    fullName: string;
    prefix: string;
    qualification: string;
    partyName: string;
    partyShortName: string;
    profileImageUrl: string;
    logoUrl: string;
    symbolUrl: string;
    isIndependent: boolean;
};

const Candidates: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [filtered, setFiltered] = useState<Candidate[]>([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Candidate>("fullName");
    const [sortAsc, setSortAsc] = useState(true);
    const [selectedParty, setSelectedParty] = useState("");
    const [partyList, setPartyList] = useState<string[]>([]);

    const getCandidates = async () => {
        const res = await apiClient.get("/Home/get-candidates");
        const data: Candidate[] = res.data ?? [];

        setCandidates(data);
        setFiltered(data);

        const parties = [...new Set(data.map((c: any) => c.partyShortName))];
        setPartyList(parties);
    };

    useEffect(() => {
        getCandidates();
    }, []);

    useEffect(() => {
        let data = [...candidates];

        // 🔍 Search
        if (search) {
            data = data.filter(c =>
                c.fullName.toLowerCase().includes(search.toLowerCase()) ||
                c.partyShortName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 🎯 Party filter
        if (selectedParty) {
            data = data.filter(c => c.partyShortName === selectedParty);
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

    const handleSort = (field: keyof Candidate) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const getSortIcon = (field: keyof Candidate) => {
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
                    onChange={(e) => setSelectedParty(e.target.value)}
                    className="border border-gray-300 bg-white px-3 py-2 rounded-lg w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Parties</option>
                    {partyList.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => {
                        setSearch("");
                        setSelectedParty("");
                    }}
                    className="bg-gray-200 px-3 py-2 rounded-lg"
                >
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="min-w-full text-sm">

                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>

                            <th className="p-3 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort("fullName")}>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    Name <span>{getSortIcon("fullName")}</span>
                                </div>
                            </th>
                            <th className="p-3 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort("qualification")}>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    Qualification {getSortIcon("qualification")}
                                </div>
                            </th>
                            <th className="p-3">Image</th>

                            <th className="p-3 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort("partyShortName")}>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    Party {getSortIcon("partyShortName")}
                                </div>
                            </th>

                            <th className="p-3">Logo</th>

                            <th className="p-3">Symbol</th>

                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.candidateId} className="border-t hover:bg-gray-50">

                                <td className="p-3 font-medium">
                                    {c.prefix} {c.fullName}
                                </td>
                                <td className="p-3">
                                    {c.qualification}
                                </td>
                                <td className="p-3">
                                    <img src={c.profileImageUrl} className="w-10 h-10 object-cover rounded-full" />
                                </td>

                                <td className="p-3">
                                    {c.partyShortName}
                                </td>

                                <td className="p-3">
                                    <img src={c.logoUrl} className="w-10 h-10 object-contain" />
                                </td>

                                <td className="p-3">
                                    <img src={c.symbolUrl} className="w-10 h-10 object-contain" />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default Candidates;