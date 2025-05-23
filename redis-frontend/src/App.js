import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AuthPage from "./AuthPage";
import AdminDashboard from "./AdminDashboard";
import ManageOfficers from "./ManageOfficers";
import UserPage from "./UserPage";
import SocioInformation from "./SocioInformation";
import ManageResidents from "./ManageResidents";
import ResidentQRCode from "./ResidentQRCode";
import OfficerQRCode from "./OfficerQRCode";
import ManageReports from "./ManageReports";
function App() {

    return (
        <Router>
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/manage-officers" element={<ManageOfficers />} />
\                <Route path="/socio-information" element={<SocioInformation />} />
                <Route path="/manage-residents" element={<ManageResidents />} />
                <Route path="/user-page" element={<UserPage />} />
                <Route path="/resident-qrcode-" element={<ResidentQRCode />} />
                <Route path="/officer-qrcode-" element={<OfficerQRCode />} />
                <Route path="/manage-reports" element={<ManageReports />} />




            </Routes>
        </Router>
    );
}

export default App;
