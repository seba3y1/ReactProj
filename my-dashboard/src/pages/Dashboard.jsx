import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserPostsCard from "../components/UserPostsCard";
import NotesCard from "../components/NotesCard";
import AnalyticsCard from "../components/AnalyticsCard";
import WeatherCard from "../components/WeatherCard";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">{user}</span>
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Dashboard Overview
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <UserPostsCard />
          </div>
          <div>
            <NotesCard />
          </div>
          <div>
            <AnalyticsCard />
          </div>
          <div className="sm:col-span-2 lg:col-span-3 hover:shadow-lg transition-shadow duration-200 rounded-2xl">
            <WeatherCard />
          </div>
        </div>
      </main>
    </div>
  );
}
