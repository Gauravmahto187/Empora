import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { Calendar, Filter, X } from "lucide-react";

const EmployeeAttendance = () => {
  const { id } = useParams();
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch employee attendance data
  const { data, isLoading, error } = useQuery({
    queryKey: ["employeeAttendance", filters, page],
    queryFn: async () => {
      const baseURL = import.meta.env.VITE_EMPORA_LINK;
      if (!baseURL) {
        throw new Error("Environment variable VITE_EMPORA_LINK is not set.");
      }
      const params = { ...filters, page, limit };

      if (!filters.startDate) delete params.startDate;
      if (!filters.endDate) delete params.endDate;

      const res = await axios.get(
        `${baseURL}/api/attendance/empattendance/${id}`,
        {
          params,
        }
      );
      return res.data;
    },
  });

  const columns = [
    { 
      accessorKey: "date", 
      header: "Date",
      cell: ({ getValue }) => {
        const date = getValue();
        return date.split('T')[0]; // This will show only YYYY-MM-DD
      }
    },
    { accessorKey: "day", header: "Day" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
          info.getValue() === "Present" ? "bg-green-100 text-green-800" :
          info.getValue() === "On Leave" ? "bg-yellow-100 text-yellow-800" :
          info.getValue() === "Holiday" ? "bg-blue-100 text-blue-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {info.getValue()}
        </span>
      )
    },
  ];

  const table = useReactTable({
    data: data?.records ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-500">Error loading attendance data</p>
    </div>
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Attendance</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">Filters</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 min-w-[200px]">
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="On Leave">On Leave</option>
            <option value="Holiday">Holiday</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all"
          onClick={() => setFilters({ status: "", startDate: "", endDate: "" })}
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page}
        </span>
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!data?.records || data.records.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
