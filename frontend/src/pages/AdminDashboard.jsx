import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/Dashboard/AdminSidebar"
import Navbar from "../components/Dashboard/Navbar"
const AdminDashboard = () => {


  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard