import React from "react";

interface CustomAlertProps {
  alert: { message: string; type: "success" | "error" } | null;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  const isSuccess = alert.type === "success";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div
          className={`px-4 py-3 flex justify-between items-center ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <h3 className="font-semibold text-sm">
            {isSuccess ? "Success" : "Error"}
          </h3>
          <button
            onClick={onClose}
            className="text-lg font-bold hover:opacity-80"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-gray-700 text-sm">
          {alert.message}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg text-white text-sm ${
              isSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;