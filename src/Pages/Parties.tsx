import { useEffect, useState } from "react";
import apiClient from "../api/apiClient.ts";

type Party = {
    partyId: number;
    partyName: string;
    partyShortName: string;
    logoUrl: string;
    symbolUrl: string;
};

const Parties: React.FC = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [filtered, setFiltered] = useState<Party[]>([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<keyof Party>("partyName");
    const [sortAsc, setSortAsc] = useState(true);

    const getParties = async () => {
        const res = await apiClient.get('/Home/get-parties');
        setParties(res.data);
        setFiltered(res.data);
    };

    useEffect(() => {
        getParties();
    }, []);

    // 🔍 Search filter
    useEffect(() => {
        let data = [...parties];

        if (search) {
            data = data.filter(p =>
                p.partyName.toLowerCase().includes(search.toLowerCase()) ||
                p.partyShortName.toLowerCase().includes(search.toLowerCase())
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
    }, [search, parties, sortField, sortAsc]);

    const handleSort = (field: keyof Party) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };
    const getSortIcon = (field: keyof Party) => {
        if (sortField !== field) return "↑↓";
        return sortAsc ? "↑" : "↓";
    };

    return (
        <div className="p-4">

            {/* 🔍 Search */}
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search party..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-64"
                />
            </div>

            {/* 📊 Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="min-w-full text-sm text-left">

                    {/* Header */}
                    <thead className="bg-gray-100 uppercase text-xs">
                        <tr>
                            <th className="p-3 cursor-pointer" onClick={() => handleSort("partyName")}>
                                Party Name {getSortIcon("partyName")}
                            </th>
                            <th className="p-3 cursor-pointer" onClick={() => handleSort("partyShortName")}>
                                Short Name {getSortIcon("partyShortName")}
                            </th>
                            <th className="p-3">Logo</th>
                            <th className="p-3">Symbol</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {filtered?.map((p) => (
                            <tr key={p.partyId} className="border-t hover:bg-gray-50">

                                <td className="p-3 font-medium">
                                    {p.partyName}
                                </td>

                                <td className="p-3">
                                    {p.partyShortName}
                                </td>

                                <td className="p-3">
                                    <img
                                        src={p.logoUrl}
                                        alt={`${p.partyShortName} logo`}
                                        className="w-10 h-10 object-contain"
                                    />
                                </td>

                                <td className="p-3">
                                    <img
                                        src={p.symbolUrl}
                                        alt={`${p.partyShortName} symbol`}
                                        className="w-10 h-10 object-contain"
                                    />
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default Parties;