import axios from "axios";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { columns, EmployeeButtons } from "../../../utils/EmployeeHelper";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Loader } from "lucide-react";

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#F3F4F6",
      fontSize: "14px",
      fontWeight: "bold",
      borderTopWidth: "1px",
      borderTopColor: "#E5E7EB",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      "&:nth-of-type(odd)": {
        backgroundColor: "#F9FAFB",
      },
      "&:hover": {
        backgroundColor: "#F3F4F6",
        cursor: "pointer",
      },
    },
  },
  pagination: {
    style: {
      fontSize: "14px",
      padding: "8px",
    },
  },
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader className="w-8 h-8 animate-spin text-teal-600" />
    <p className="mt-2 text-gray-600">Loading employees...</p>
  </div>
);

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchEmployees = async () => {
    setEmpLoading(true);
    try {
      const baseURL = import.meta.env.VITE_EMPORA_LINK;
      if (!baseURL) {
        console.error("Environment variable REACT_APP_EMPORA_LINK is not set.");
        return;
      }
      const response = await axios.get(`${baseURL}/api/employee`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      if (response.data.success) {
        let sno = 1;
        const data = await response.data.employees.map((emp) => ({
          _id: emp._id,
          sno: sno++,
          dep_name: emp.department.dep_name,
          name: emp.userId.name,
          role: emp.userId.role,
          dob: new Date(emp.dob).toLocaleDateString(),
          profileImage: <img width={40} className="rounded-full object-cover shadow-sm border border-gray-200" src={`${baseURL}/${emp.userId.profileImage}`} alt={emp.userId.name} />,
          action: (<EmployeeButtons Id={emp._id} onDelete={fetchEmployees} />),
        }));
        setEmployees(data);
        setFilteredEmployee(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setEmpLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const records = employees.filter((emp) => (
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    ));
    setFilteredEmployee(records);
  };

  if (user.role === "accountant") {
    navigate("/admin-dashboard");
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Manage Employees</h3>
            <p className="text-gray-600 mt-1">View and manage your organization&apos;s employees</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees by name..."
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                onChange={handleFilter}
              />
            </div>
            <Link
              to="/admin-dashboard/add-employee"
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New Employee</span>
            </Link>
          </div>

          <div className="mt-6 border rounded-lg overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredEmployee}
              pagination
              progressPending={empLoading}
              progressComponent={<LoadingSpinner />}
              customStyles={customStyles}
              striped
              highlightOnHover
              responsive
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
