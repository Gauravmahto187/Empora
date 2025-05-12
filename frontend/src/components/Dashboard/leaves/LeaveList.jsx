import axios from "axios";
import { useEffect, useState } from "react";
import { LeaveButtons } from "../../../utils/LeaveHelper";
import { Search, CalendarDays, Loader2, Filter, ChevronDown } from "lucide-react";
import { months, formatDate, calculateDays, filterByMonth } from "../../../utils/DateHelper";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const fetchLeaves = async () => {
    try {
      const baseURL = import.meta.env.VITE_EMPORA_LINK;
      if (!baseURL) {
        console.error("Environment variable VITE_EMPORA_LINK is not set.");
        return;
      }

      const response = await axios.get(`${baseURL}/api/leave`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
 
      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          startDate: formatDate(leave.startDate),
          endDate: formatDate(leave.endDate),
          days: calculateDays(leave.startDate, leave.endDate),
          reason: leave.reason,
          status: leave.status,
          action: <LeaveButtons Id={leave._id} onUpdate={fetchLeaves} />,
        }));
        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    let filtered = leaves;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (leave) =>
          leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leave.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (leave) => leave.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply month filter
    filtered = filterByMonth(filtered, monthFilter);

    setFilteredLeaves(filtered);
  }, [searchTerm, statusFilter, monthFilter, leaves]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-800">Leave Requests</h2>
          <CalendarDays className="w-6 h-6 text-gray-400" />
        </div>
        <div className="text-sm text-gray-500">
          Total Requests: {filteredLeaves.length}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none cursor-pointer"
            >
              {months.map((month) => (
                <option key={month.label} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              <span>Status:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter(statusFilter === "pending" ? "" : "pending")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === "approved" ? "" : "approved")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === "rejected" ? "" : "rejected")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Rejected
              </button>
              {statusFilter && (
                <button
                  onClick={() => setStatusFilter("")}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">S.N</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Employee ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Leave Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">From</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">To</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Days</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLeaves.map((leave) => (
              <tr key={leave._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{leave.sno}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.employeeId}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{leave.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.department}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.leaveType}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.startDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.endDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.days}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{leave.reason}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    leave.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : leave.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {leave.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{leave.action}</td>
              </tr>
            ))}
            {filteredLeaves.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveList;
