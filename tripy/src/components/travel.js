import React, { useState, useRef, useEffect } from "react";
import {
  //   Menu,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  Settings as Setting,
  User,
  Moon,
  Sun,
  MapPin,
  DollarSign,
  Calendar,
} from "lucide-react";
import { mockUser } from "./data";
import Profile from "./profile";
import { useNavigate } from "react-router-dom";

const TravelAssistant = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            content:
              "Hello, welcome to Travel Assistant. How may I assist you in your travel or other queries today?",
          },
        ];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [{ id: 1, title: "New Chat" }];
  });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(mockUser);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved
      ? JSON.parse(saved)
      : {
          darkMode: false,
          notificationSound: true,
        };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { role: "user", content: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.bot,
          structuredData: typeof data.bot === "object" ? data.bot : null,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatHistory");
    setUser(null);
    navigate("/login");
  };

  const renderStructuredResponse = (data) => {
    if (!data || !data.response_type) return null;

    switch (data.response_type) {
      case "travel_suggestions":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.locations.map((location, index) => (
              <Card key={index} item={location} type="travel_suggestions" />
            ))}
          </div>
        );
      case "area_recommendations":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.areas.map((area, index) => (
              <Card key={index} item={area} type="area_recommendations" />
            ))}
          </div>
        );
      case "house_prices":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.houses.map((house, index) => (
              <Card key={index} item={house} type="house_prices" />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const baseClasses = settings.darkMode ? "light" : "";

  return (
    <div
      className={`${baseClasses} flex h-screen bg-gray-100 dark:bg-gray-900`}
    >
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-gray-800 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4">
          <button
            className="w-full bg-gray-700 text-white rounded-lg p-3 hover:bg-gray-600 transition"
            onClick={() => {
              setChatHistory([
                ...chatHistory,
                { id: chatHistory.length + 1, title: "New Chat" },
              ]);
              setMessages([
                {
                  role: "assistant",
                  content:
                    "Hello, welcome to Travel Assistant. How may I assist you in your travel or other queries today?",
                },
              ]);
            }}
          >
            New Chat
          </button>
        </div>
        <div className="overflow-y-auto">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className="px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer transition"
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {isSidebarOpen ? (
                <ChevronLeft size={24} className=" dark:text-white" />
              ) : (
                <ChevronRight size={24} className=" dark:text-white" />
              )}
            </button>
            <h1 className="ml-4 text-xl font-semibold dark:text-white">
              TravelAI
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Setting size={24} className=" dark:text-white" />
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <User size={24} className=" dark:text-white" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 dark:bg-gray-900">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                }`}
              >
                {message.structuredData ? (
                  renderStructuredResponse(message.structuredData)
                ) : (
                  <pre className="whitespace-pre-wrap font-sans">
                    {message.content}
                  </pre>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-lg">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="max-w-4xl mx-auto flex items-end gap-4">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 resize-none rounded-lg border dark:border-gray-700 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
};

// Create a custom hook for chat persistence
const useChatPersistence = (initialState, storageKey) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  return [state, setState];
};

// Create a ChatProvider component for managing global chat state
const ChatContext = React.createContext();

const ChatProvider = ({ children }) => {
  const [chats, setChats] = useChatPersistence([], "chats");
  const [activeChat, setActiveChat] = useChatPersistence(null, "activeChat");
  const [settings, setSettings] = useChatPersistence(
    {
      darkMode: false,
      notificationSound: true,
      fontSize: "medium",
      language: "english",
    },
    "settings"
  );

  const value = {
    chats,
    setChats,
    activeChat,
    setActiveChat,
    settings,
    setSettings,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

const Card = ({ item, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 
              ${isExpanded ? "max-w-2xl w-full" : "max-w-sm w-full"}`}
    >
      <div className="relative">
        {item.image_url && (
          <div className={`w-full ${isExpanded ? "h-64" : "h-48"} relative`}>
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold">{item.name}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {type === "travel_suggestions" && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MapPin size={16} />
            <span>{item.interest}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <DollarSign size={16} />
          <span>{item.price}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Calendar size={16} />
          <span>{item.availability}</span>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {item.description && (
              <p className="text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            )}

            {item.amenities && (
              <div className="space-y-2">
                <h4 className="font-medium">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {item.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              View Details
            </button>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
};

const Settings = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = () => {
    onUpdateSettings(tempSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={20} className=" dark:text-white"/>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium dark:text-white">Appearance</h3>

            <div className="flex items-center justify-between">
              <span className="dark:text-gray-300">Dark Mode</span>
              <button
                onClick={() =>
                  setTempSettings({
                    ...tempSettings,
                    darkMode: !tempSettings.darkMode,
                  })
                }
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                {tempSettings.darkMode ? (
                  <Sun size={20} className=" dark:text-white" />
                ) : (
                  <Moon size={20} className=" dark:text-white" />
                )}
              </button>
            </div>

            <div className="space-y-2">
              <span className="dark:text-gray-300">Font Size</span>
              <select
                value={tempSettings.fontSize}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, fontSize: e.target.value })
                }
                className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium dark:text-white">Notifications</h3>

            <div className="flex items-center justify-between">
              <span className="dark:text-gray-300">Sound</span>
              <input
                type="checkbox"
                checked={tempSettings.notificationSound}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    notificationSound: e.target.checked,
                  })
                }
                className="toggle"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium dark:text-white">Language</h3>

            <select
              value={tempSettings.language}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, language: e.target.value })
              }
              className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TravelAssistant, ChatProvider };
