import { Route, Routes } from "react-router-dom"
import Auth from "../pages/admin/Auth"
import Dashboard from "../pages/admin/Dashboard"



function Admin() {
  return (
    <Routes>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default Admin
