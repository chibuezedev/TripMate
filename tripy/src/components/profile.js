import React from "react";
import { X, LogOut } from "lucide-react";

const Profile = ({ user, isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full"
          />
          <h3 className="text-xl font-medium">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
