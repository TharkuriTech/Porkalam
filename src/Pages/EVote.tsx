import { useEffect, useState } from "react";
import apiClient from "../api/apiClient.ts";
import { ICandidate } from "../Util/Util.ts";
import CustomAlert from "../Components/CustomAlert.tsx";
import nota from "../Images/nota.png";
import Loader from "../Components/Loader.tsx";

const NOTA_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23e5e7eb' /%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%232d3748' font-size='12' font-family='Arial, sans-serif'%3ENOTA%3C/text%3E%3C/svg%3E";

const EVote: React.FC = () => {
  const targetDate = new Date("2026-04-24T00:00:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [subscribed, setSubscribed] = useState(false);
  const [electionStarted, setElectionStarted] = useState(true);
  const [isUserVoted, setIsUserVoted] = useState(false);
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingCandidateId, setVotingCandidateId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const getEVoteData = async () => {
    try {
      const response = await apiClient.get("/EVote/get-evote-data");
      setIsUserVoted(response.data.isUserVoted);
      const mappedCandidates = response.data.candidates.map((c: any) => ({
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
    } catch (error) {
      console.error("Failed to fetch e-vote data:", error);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (candidateId: number) => {
    setVotingCandidateId(candidateId);
    try {
      setLoading(true);
      const response = await apiClient.get(`/EVote/cast-vote/${candidateId}`);
      if (response.data.isSuccess) {
        setIsUserVoted(true);
        setAlert({ message: response.data.message || "Vote cast successfully!", type: 'success' });
      } else {
        setAlert({ message: response.data.message || "Failed to cast vote", type: 'error' });
      }
    } catch (error) {
      console.error("Failed to cast vote:", error);
      setAlert({ message: "Failed to cast vote. Please try again.", type: 'error' });
    } finally {
      setLoading(false);
      setVotingCandidateId(null);
    }
  };

  // ⏳ Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getEVoteData();
  }, []);

  const handleNotify = () => {
    // 🔔 for now just toggle (later connect API)
    setSubscribed(true);
  };

  return (
    <>
      {loading && <Loader />}
      {electionStarted ? (
        <div className="bg-white p-2 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-3">Vote For Your Candidate</h3>
          {isUserVoted ? (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">

              <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">

                <h2 className="text-2xl font-semibold mb-3">
                  🗳️ eVote
                </h2>

                <p className="text-xl font-medium text-gray-800 mb-2">
                  You have already voted!
                </p>

                <p className="text-gray-500 mb-4">
                  Wait for results <span className="font-semibold text-blue-600">24 April 2026</span>
                </p>

                {/* ⏳ Countdown */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hrs", value: timeLeft.hours },
                    { label: "Min", value: timeLeft.minutes },
                    { label: "Sec", value: timeLeft.seconds },
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-2">
                      <p className="text-lg font-semibold">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto justify-self-center">
              {candidates.length > 0 ? (
                <>
                  {candidates.map((c, i) => (
                    <div
                      key={c.candidateId}
                      className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      {/* Left Section */}
                      <div className="flex items-center gap-2">

                        {/* 👇 Show only on md+ screens */}
                        <img
                          src={c.image}
                          alt={c.name}
                          className="hidden md:block w-12 h-12 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-semibold">
                            <a
                              href={c.description}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {c.name}
                            </a>
                          </p>

                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            {c.isIndependent ? (
                              c.partyName
                            ) : (
                              <>
                                <img
                                  src={c.partyLogo}
                                  alt={c.partyShortName}
                                  className="w-4 h-4"
                                />
                                {c.partyShortName}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-4 md:gap-6">

                        {/* Symbol */}
                        <img
                          src={c.symbol}
                          alt="symbol"
                          className="w-10 h-10"
                        />

                        {/* Button */}
                        <button
                          onClick={() => castVote(c.candidateId)}
                          disabled={votingCandidateId !== null}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                          {votingCandidateId === c.candidateId ? "Voting..." : "Vote"}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div
                    key="nota"
                    className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={NOTA_IMAGE}
                        alt="NOTA"
                        className="hidden md:block w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-black-600 text-lg">NOTA</p>
                        {/* <div className="text-sm text-gray-500">None of the Above</div> */}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                      <img
                        src={nota}
                        alt="NOTA symbol"
                        className="h-10"
                      />
                      <button
                        onClick={() => castVote(-1)}
                        disabled={votingCandidateId !== null}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                      >
                        {votingCandidateId === -1 ? "Voting..." : "Vote"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  No candidates available.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">

          <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">

            <h2 className="text-2xl font-semibold mb-3">
              🗳️ eVote
            </h2>

            <p className="text-xl font-medium text-gray-800 mb-2">
              Coming Soon
            </p>

            <p className="text-gray-500 mb-4">
              Voting opens on <span className="font-semibold text-blue-600">14 April 2026</span>
            </p>

            {/* ⏳ Countdown */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hrs", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((item, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-2">
                  <p className="text-lg font-semibold">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>

            {/* 🔔 Notify Button */}
            {!subscribed ? (
              <button
                onClick={handleNotify}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
              >
                🔔 Notify Me
              </button>
            ) : (
              <p className="text-green-600 font-medium">
                ✅ You’ll be notified!
              </p>
            )}

          </div>

        </div>
      )}
      <CustomAlert alert={alert} onClose={() => setAlert(null)} />
    </>
  );
};

export default EVote;