/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchDepartments } from "../../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Loader, ArrowLeft, Upload } from "lucide-react";
import toast from "react-hot-toast";

const FormField = ({ label, children, required }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-900">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    department: "",
    designation: "",
    role: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prevData) => ({ ...prevData, [name]: file }));
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else if (name === "role") {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      setFormData((prevData) => ({ ...prevData, [name]: selectedOptions }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Adding new employee...");

    try {
      // Validate required fields
      const requiredFields = [
        'name',
        'email',
        'employeeId',
        'dob',
        'gender',
        'maritalStatus',
        'designation',
        'department',
        'salary',
        'password'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      if (!formData.role || formData.role.length === 0) {
        formData.role = ["employee"];
      }

      const formDataObj = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === 'image') {
          if (formData[key]) {
            formDataObj.append('image', formData[key]);
          }
        } else {
          formDataObj.append(key, formData[key]);
        }
      });

      const baseURL = import.meta.env.VITE_EMPORA_LINK;
      if (!baseURL) {
        throw new Error("Environment variable VITE_EMPORA_LINK is not set.");
      }

      const response = await axios.post(`${baseURL}/api/employee/add`, formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success("Employee added successfully!");
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to add employee";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(loadingToast);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
            <p className="mt-1 text-sm text-gray-600">Add a new employee to your organization</p>
          </div>
          <Link
            to="/admin-dashboard/employees"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Employees</span>
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Profile Image Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-500">Upload photo</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Personal Information</h3>
                <FormField label="Name" required>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  />
                </FormField>

                <FormField label="Email" required>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  />
                </FormField>

                <FormField label="Date of Birth" required>
                  <input
                    type="date"
                    name="dob"
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  />
                </FormField>

                <FormField label="Gender" required>
                  <select
                    name="gender"
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>

                <FormField label="Marital Status" required>
                  <select
                    name="maritalStatus"
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </FormField>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Employment Information</h3>
                <FormField label="Employee ID" required>
                  <input
                    type="text"
                    name="employeeId"
                    onChange={handleChange}
                    placeholder="Enter employee ID"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  />
                </FormField>

                <FormField label="Designation" required>
                  <input
                    type="text"
                    name="designation"
                    onChange={handleChange}
                    placeholder="Enter designation"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  />
                </FormField>

                <FormField label="Department" required>
                  <select
                    name="department"
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map((dep) => (
                      <option key={dep._id} value={dep._id}>
                        {dep.dep_name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Salary" required>
                  <input
                    type="number"
                    name="salary"
                    onChange={handleChange}
                    placeholder="Enter salary"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  />
                </FormField>

                <FormField label="Role">
                  <select
                    name="role"
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                    <option value="accountant">Accountant</option>
                  </select>
                </FormField>

                <FormField label="Password" required>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
                    required
                  />
                </FormField>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Adding Employee...</span>
                  </>
                ) : (
                  <span>Add Employee</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
