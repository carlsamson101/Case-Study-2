import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageReports.css';  // Assuming you will create a separate CSS file for styling

function ManageReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState("manage-reports");
  const userRole = localStorage.getItem('userRole');  // Retrieve user role
  const [successMessage, setSuccessMessage] = useState('');
  

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setReports(data); // Set the reports in state
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch reports');
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token"); // Remove token if stored
      navigate("/auth"); // Redirect to login page
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (response.ok) {
        const updatedReports = reports.map((report) =>
          report._id === reportId ? { ...report, status: newStatus } : report
        );
        setReports(updatedReports);
        setSuccessMessage("✅ Report status updated successfully.");
  
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error.");
    }
  };

  const handleDelete = async (reportId, residentName) => {
    const enteredName = prompt("Please enter the resident name to confirm deletion:", "");
  
    // If user presses cancel or enters nothing
    if (!enteredName || enteredName.trim() === "") {
      alert("Resident name is required to delete.");
      return;
    }
  
    // Check if the entered name matches the report's resident name
    if (enteredName !== residentName) {
      alert("Resident name does not match.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ residentName: enteredName }),  // Send resident name for matching
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("✅ Report deleted successfully.");
        // Refresh the page after successful deletion
        window.location.reload();  // This reloads the page and fetches the updated list of reports
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Failed to delete report:", err);
      alert("Error deleting report.");
    }
  };

  return (
    <div className="manage-reports">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>{userRole === "admin" ? "Admin Panel" : "Officer Panel"}</h2>
        <ul>
          {userRole === "admin" && (
            <li
              className={selectedPage === "dashboard" ? "active" : ""}
              onClick={() => {
                setSelectedPage("dashboard");
                navigate("/admin-dashboard");
              }}
            >
              Dashboard
            </li>
          )}

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

          {userRole === "admin" && (
            <>
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
            </>
          )}

          <div className="divider"></div>

          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </aside>

      <div className="content">
        <h3>Manage Reports</h3>

        {error && <p className="error">{error}</p>}

        {/* Reports Table */}
        <div className="reports-table">

        {successMessage && (
  <div className="success-dialog">
    {successMessage}
  </div>
)}
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Resident</th>
                <th>Purok</th>
                <th>Street</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report._id}>
                    <td>{report.title}</td>
                    <td>{report.description}</td>
                    <td>{report.residentName}</td>
                    <td>{report.purok}</td>
                    <td>{report.street}</td>
                    <td>
                      {/* Editable Status */}
                      <select
  value={report.status}
  onChange={(e) => handleStatusChange(report._id, e.target.value)}
>
  <option value="Pending">Pending</option>
  <option value="Completed">Completed</option>
</select>
                    </td>
                    <td>
                    <button
  onClick={() => handleDelete(report._id, report.residentName)}  // Pass resident name as well
  style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px' }}
>
  Delete
</button>
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No reports available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageReports;