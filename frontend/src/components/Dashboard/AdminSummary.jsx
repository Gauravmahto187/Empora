import {
  Users,
  Building2,
  CircleCheck,
  XCircle,
  FileText,
  Clock,
  Wallet,
  TrendingUp,
  CalendarRange,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { holidays } from "./Holidays/holidayData";

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await axios.get(
          "http://localhost:3000/api/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(summary);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        }
        console.log(error.message);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Company Overview Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Company Overview
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Key metrics and statistics
            </p>
          </div>
          <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Monthly Report</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Employees</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.data.totalEmployees}
                </h3>
              </div>
              <div className="bg-[#E7FAF5] p-2 rounded-lg">
                <Users className="w-5 h-5 text-[#00A76F]" strokeWidth={2} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Departments</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.data.totalDepartments}
                </h3>
              </div>
              <div className="bg-[#EFF4FB] p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-[#3366FF]" strokeWidth={2} />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Active departments</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Salary</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  Nrs. {summary.data.totalSalary}
                </h3>
              </div>
              <div className="bg-[#E7FAF5] p-2 rounded-lg">
                <Wallet className="w-5 h-5 text-[#00A76F]" strokeWidth={2} />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-[#00A76F] font-medium">
                On track
              </span>
              <span className="text-xs text-gray-500">for this month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Holidays</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {holidays.length}
                </h3>
              </div>
              <div className="bg-[#EFF4FB] p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-[#3366FF]" strokeWidth={2} />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Year 2081 BS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Management Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Leave Management
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Overview of employee leaves
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
            <CalendarRange className="w-4 h-4" />
            <span className="text-sm font-medium">This Month</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-500">Total Applied</p>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.data.leaveSummary.appliedFor}
                </h3>
              </div>
              <div className="bg-blue-50 px-2 py-0.5 rounded text-xs font-medium text-blue-700">
                This Month
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CircleCheck className="w-4 h-4 text-emerald-600" />
                  <p className="text-sm text-gray-500">Approved</p>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.data.leaveSummary.approved}
                </h3>
              </div>
              <div className="bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium text-emerald-700">
                {Math.round(
                  (summary.data.leaveSummary.approved /
                    summary.data.leaveSummary.appliedFor) *
                    100
                )}
                %
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.data.leaveSummary.pending}
                </h3>
              </div>
              <div className="bg-amber-50 px-2 py-0.5 rounded text-xs font-medium text-amber-700">
                Needs Action
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <p className="text-sm text-gray-500">Rejected</p>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary.data.leaveSummary.rejected}
                </h3>
              </div>
              <div className="bg-rose-50 px-2 py-0.5 rounded text-xs font-medium text-rose-700">
                Not Approved
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
