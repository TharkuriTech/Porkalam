import { useEffect, useState } from "react";

const EVote: React.FC = () => {
  const targetDate = new Date("2026-04-14T00:00:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [subscribed, setSubscribed] = useState(false);

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

  const handleNotify = () => {
    // 🔔 for now just toggle (later connect API)
    setSubscribed(true);
  };

  return (
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
  );
};

export default EVote;