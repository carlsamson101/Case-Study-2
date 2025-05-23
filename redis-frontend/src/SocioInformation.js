import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SocioInformation.css";

function SocioInformation() {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState("socio-information");
  const [residents, setResidents] = useState([]); // Store residents from backend
  const [officers, setOfficers] = useState([]); // Store residents from backend
  const [error, setError] = useState("");

  const backendURL = process.env.REACT_APP_BACKEND === 'mongo'
  ? 'http://localhost:5000'
  : 'http://localhost:3000';


  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
  };
  

  // Function to classify income levels (based on PIDS classification)
  const classifyIncome = (income) => {
    if (income < 21000) return "Low Income";
    if (income < 44000) return "Lower Middle Class";
    if (income < 77000) return "Middle Class";
    if (income < 132000) return "Upper Middle Class";
    if (income < 219000) return "High Income (Not Rich)";
    return "Rich";
  };

  // Fetch residents from the backend
const fetchResidents = () => {
  axios.get(`${backendURL}/residents`) // Corrected: remove the extra axios
    .then((response) => {
      console.log("📌 Residents Data Received:", response.data); // Debugging
      setResidents(response.data);
    })
    .catch((error) => {
      console.error("❌ Error Fetching Residents:", error);
      setError("❌ Failed to load residents");
    });
};

  // Fetch data on component mount
  useEffect(() => {
    fetchResidents();
  }, []);

   // Fetch residents from the backend
   const fetchOfficers = () => {
    axios.get(`${backendURL}/officers`)   // Fix here: Use axios.get
    .then((response) => {
        console.log("📌 Officers Data Received:", response.data); // Debugging
        setOfficers(response.data);
      })
      .catch((error) => {
        console.error("❌ Error Fetching Officers:", error);
        setError("❌ Failed to load officers");
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchOfficers();
  }, []);


  

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={selectedPage === "dashboard" ? "active" : ""}
            onClick={() => {
              setSelectedPage("dashboard");
              navigate("/admin-dashboard");
            }}
          >
            Dashboard
          </li>
          <div className="divider"></div>
          <li
            className={selectedPage === "manage-residents" ? "active" : ""}
            onClick={() => {
              setSelectedPage("manage-residents");
              navigate("/manage-residents");
            }}
          >
            Manage Residents
          </li>

          <li
            className={selectedPage === "manage-reports" ? "active" : ""}
            onClick={() => {
              setSelectedPage("manage-reports");
              navigate("/manage-reports");
            }}
          >
            Manage Reports
          </li>
          
          
          <li
            className={selectedPage === "manage-officers" ? "active" : ""}
            onClick={() => {
              setSelectedPage("manage-officers");
              navigate("/manage-officers");
            }}
          >
            Manage Officers
          </li>

       
          <li
            className={selectedPage === "socio-information" ? "active" : ""}
            onClick={() => {
              setSelectedPage("socio-information");
              navigate("/socio-information");
            }}
          >
            Socioeconomic Information
          </li>
          <div className="divider"></div>
          <li className="logout" onClick={handleLogout}>
  Logout
</li>

        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>Socioeconomic Information</h1>
        </header>

        <div className="content">
          <h2>Resident Socioeconomic Data</h2>

          {error && <p className="error">{error}</p>}

          <div className="table-container">
            <table className="socio-table">
              <thead>
                <tr>
                  <th>Resident ID</th>
                  <th>Full Name</th>
                  <th>Occupation</th>
                  <th>Annual Income</th>
                  <th>Income Level</th>
                  <th>Beneficiary Status</th>
                </tr>
              </thead>
              <tbody>
                {residents.length > 0 ? (
                  residents.map((resident) => (
                    <tr key={resident.id}>
                      <td>{resident.id}</td>
                      <td>{`${resident.firstName} ${resident.middleInitial}. ${resident.lastName}`}</td>
                      <td>{resident.occupation || "N/A"}</td>
                      <td>₱{resident.annualIncome.toLocaleString()}</td>
                      <td>{classifyIncome(resident.annualIncome)}</td>
                      <td>{resident.beneficiaryStatus || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
                <br></br><br></br>
          <h2>Officer Socioeconomic Data</h2>

          {error && <p className="error">{error}</p>}

          <div className="table-container">
            <table className="socio-table">
              <thead>
                <tr>
                  <th>Officer ID</th>
                  <th>Full Name</th>
                  <th>Occupation</th>
                  <th>Annual Income</th>
                  <th>Income Level</th>
                  <th>Beneficiary Status</th>
                </tr>
              </thead>
              <tbody>
                {officers.length > 0 ? (
                  officers.map((officer) => (
                    <tr key={officer.id}>
                      <td>{officer.id}</td>
                      <td>{`${officer.firstName} ${officer.middleInitial}. ${officer.lastName}`}</td>
                      <td>{officer.occupation || "N/A"}</td>
                      <td>₱{officer.annualIncome.toLocaleString()}</td>
                      <td>{classifyIncome(officer.annualIncome)}</td>
                      <td>{officer.beneficiaryStatus || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SocioInformation;