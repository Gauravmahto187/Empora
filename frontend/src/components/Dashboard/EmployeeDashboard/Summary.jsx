import { useEffect, useState } from "react";
import axios from "axios";
import { User, Bell, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../../context/authContext";
import { toast } from "react-hot-toast";

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotices = async () => {
      const baseURL = import.meta.env.VITE_EMPORA_LINK;
      if (!baseURL) {
        throw new Error("Environment variable VITE_EMPORA_LINK is not set.");
      }
      try {
        const response = await axios.get(
          `${baseURL}/api/notice`,
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (response.data.success) {
          setNotices(response.data.notices);
        } else {
          throw new Error("Failed to fetch notices");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Error fetching notices";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-3 rounded-lg shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-lg text-gray-600">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Notices Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-800">Latest Notices</h2>
        </div>
        
        {/* Loading and Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
            <p className="text-gray-600">Loading notices...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Bell className="w-8 h-8 mb-2" />
            <p>No notices available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="group p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-teal-200 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-200">
                  {notice.title}
                </h3>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{notice.content}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Posted on {new Date(notice.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeList;
