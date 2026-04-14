import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import '../Styles/Home.css';
import apiClient from '../api/apiClient.ts';
import { IUserData, getUserData, clearUserData, ICandidate } from '../Util/Util.ts';
import Loader from '../Components/Loader.tsx';

interface IThought {
    message: string;
}
function UpcomingElectionCard({ navigate }: { navigate: (path: string) => void }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow content-center">
            <h3 className="text-lg font-semibold">Upcoming Election</h3>

            <p className="text-2xl font-bold text-blue-600 mb-4">
                23 April 2026
            </p>
            <h3 className="text-lg font-semibold">But E-Election Started here</h3>

            <button onClick={() => navigate('/e-vote')} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                E-Vote Now
            </button>
            <p className="text-gray-500 mt-2">
                Tamil Nadu Legislative Assembly election
            </p>
        </div>
    );
}
function OpinionPollCard({ hasVoted = false, wantChange = { yes: 0, no: 0 }, onVoteClick }: { hasVoted?: boolean; wantChange?: { yes: number; no: number }; onVoteClick: () => void }) {
    const data = [
        { name: "Looking for change", value: wantChange.yes, color: "#4F46E5" },
        { name: "Wants current leadership", value: wantChange.no, color: "#F59E0B" },
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white p-4 rounded-2xl shadow h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">
                Public Opinion Poll
            </h3>

            {/* Chart + Legend */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">

                {/* Pie Chart */}
                <div className="w-[140px] h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={60}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-3 items-center md:items-start">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="text-sm text-gray-700 text-center md:text-left">
                                {item.name} (
                                {total > 0
                                    ? ((item.value / total) * 100).toFixed(0)
                                    : 0}
                                %)
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Question + CTA */}
            <div className="mt-auto">
                {!hasVoted ? (
                    <>
                        <p className="text-gray-600 mb-3 text-sm">
                            What’s your preference for the upcoming election?
                        </p>
                        <button onClick={onVoteClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                            Vote Now
                        </button>
                    </>
                ) : (
                    <p className="text-green-600 font-medium">
                        ✅ Thanks for voting!
                    </p>
                )}
            </div>
        </div>
    );
}
function CandidatesList({ candidates = [] }: { candidates: ICandidate[] }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow max-h-[440px]">
            <h3 className="text-lg font-semibold mb-3">Your Constituency Candidates</h3>

            <div className="space-y-3 max-h-[320px] overflow-y-auto">
                {candidates.length > 0 ? (candidates?.map((c, i) => (
                    <div
                        key={c.candidateId}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 justify-between"
                    >
                        <img
                            src={c.image}
                            alt={`${c.name.toLocaleLowerCase()} image`}
                            className="w-12 h-12 rounded-full"
                        />

                        <div>
                            <p className="font-semibold">
                                <a href={c.description} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {c.name}
                                </a>
                            </p>
                            <p className="text-sm text-gray-500">
                                {c.isIndependent ? c.partyName : c.partyShortName}
                            </p>
                        </div>

                        <img
                            src={c.symbol}
                            alt={`${c.partyShortName} symbol`}
                            className="w-10 h-10"
                        />
                    </div>
                ))) : (
                    <p className="text-gray-500 text-sm">
                        No candidates available.
                    </p>
                )}
            </div>
        </div>
    );
}
function PeopleThoughts({ thoughts = [], onAddThoughtClick }: { thoughts: IThought[]; onAddThoughtClick: () => void }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow max-h-[440px]">
            <div className="relative mb-3">
                <h3 className="text-lg font-semibold text-center">
                    People’s Thoughts
                </h3>
                <button
                    type="button"
                    onClick={onAddThoughtClick}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                    aria-label="Add thought"
                >
                    💬
                </button>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto">
                {thoughts.map((t, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                        <p className="text-gray-700 text-sm">{t.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            - Anonymous
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
const Home: React.FC = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState<IUserData | null>(null);
    const [loading, setLoading] = useState(true);

    const [hasVoted, setHasVoted] = useState(false);
    const [wantChange, setWantChange] = useState({ yes: 0, no: 0 });
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [thoughts, setThoughts] = useState<IThought[]>([]);

    // Modal states
    const [showPollModal, setShowPollModal] = useState(false);
    const [showThoughtModal, setShowThoughtModal] = useState(false);
    const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
    const [thoughtMessage, setThoughtMessage] = useState('');

    useEffect(() => {
        const user = getUserData();

        if (user) {
            setUserData(user);
            getDashboardData(user.userId);
        } else {
            handleLogout();
        }
    }, [navigate]);

    // ✅ Updated function
    const getDashboardData = async (userId: number) => {
        try {
            setLoading(true);

            const response = await apiClient.get(`/Home/get-dashboard-data/${userId}`);

            const data = response.data;

            // 🗳️ Poll
            setHasVoted(data.poll?.isUserVoted ?? false);
            setWantChange({
                yes: data.poll?.wantChange?.yesCount ?? 0,
                no: data.poll?.wantChange?.noCount ?? 0
            });

            // 🧑‍💼 Candidates
            const mappedCandidates = data.candidates.map((c: any) => ({
                candidateId: c.candidateId,
                name: c.candidateName,
                description: c.description,
                image: c.profileImageUrl,
                isIndependent: c.isIndependent,
                partyName: c.partyName,
                partyShortName: c.partyShortName,
                partyLogo: c.logoUrl,
                symbol: c.symbolUrl
            }));

            setCandidates(mappedCandidates);

            // 💬 Thoughts
            setThoughts(data.thoughts ?? []);

        } catch (error) {
            console.error('Dashboard fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearUserData();
        navigate('/');
    };
    // Poll vote handler
    const handleVote = async () => {
        if (!selectedVote || !userData) return;
        try {
            await apiClient.post('/Home/add-poll-vote', {
                UserId: userData.userId,
                WantChange: selectedVote === 'yes'
            });
            setHasVoted(true);
            setWantChange(prev => ({
                ...prev,
                [selectedVote]: prev[selectedVote] + 1
            }));
            setShowPollModal(false);
            setSelectedVote(null);
        } catch (error) {
            console.error('Vote failed:', error);
        }
    };

    // Thought submit handler
    const handleAddThought = async () => {
        if (!thoughtMessage.trim() || !userData) return;
        try {
            await apiClient.post('/Home/add-thought', {
                UserId: userData.userId,
                Message: thoughtMessage
            });
            setThoughts(prev => [...prev, { message: thoughtMessage }]);
            setShowThoughtModal(false);
            setThoughtMessage('');
        } catch (error) {
            console.error('Add thought failed:', error);
        }
    };
    if (loading) {
        return <Loader />;
    }

    if (!userData) return null;

    return (
        <div className="home-container">
            <div className="home-card">

                {/* Header */}
                <div className="home-header">
                    <h2 className="text-2xl font-semibold">
                        Welcome, {userData.fullName}{' '}
                        <span className="text-gray-500">
                            ({userData.userName})
                        </span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <UpcomingElectionCard navigate={navigate} />
                    <OpinionPollCard
                        hasVoted={hasVoted}
                        wantChange={wantChange}
                        onVoteClick={() => setShowPollModal(true)}
                    />
                    <CandidatesList candidates={candidates} />
                    <PeopleThoughts
                        thoughts={thoughts}
                        onAddThoughtClick={() => setShowThoughtModal(true)}
                    />
                </div>
            </div>

            {/* Poll Modal */}
            {showPollModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
                        <p className="text-gray-600 mb-4">What’s your preference for the upcoming election?</p>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="vote"
                                    value="yes"
                                    checked={selectedVote === 'yes'}
                                    onChange={() => setSelectedVote('yes')}
                                    className="mr-2"
                                />
                                Looking for change
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="vote"
                                    value="no"
                                    checked={selectedVote === 'no'}
                                    onChange={() => setSelectedVote('no')}
                                    className="mr-2"
                                />
                                Continue with current leadership
                            </label>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setShowPollModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVote}
                                disabled={!selectedVote}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                            >
                                Submit Vote
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Thought Modal */}
            {showThoughtModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Share Your Thought</h3>
                        <textarea
                            value={thoughtMessage}
                            onChange={(e) => setThoughtMessage(e.target.value)}
                            placeholder="Enter your thought..."
                            className="w-full p-3 border rounded-lg resize-none"
                            rows={4}
                            maxLength={200}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowThoughtModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddThought}
                                disabled={!thoughtMessage.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
