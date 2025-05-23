import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageOfficers.css";
import ViewOfficerModal from "./ViewOfficerModal"; // Import View Modal
import OfficerQRCode from './OfficerQRCode'; // Adjust path as needed


function ManageOfficers() {
  const [officers, setOfficers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add", "edit", "view"
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState("manage-officers");

  
  const backendURL = process.env.REACT_APP_BACKEND === 'mongo'
  ? 'http://localhost:5000'
  : 'http://localhost:3000';
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = () => {
    axios.get(`${backendURL}/officers?t=${Date.now()}`)
      .then((response) => {
        console.log("📥 Officers Data:", response.data); // Debugging
        setOfficers(response.data); // Update state with fetched data
      })
      .catch((error) => {
        console.error("❌ Fetch Officers Error:", error);
        alert("❌ Failed to load officers");
      });
  };
  
  
  // Add Officer Function
  const handleAddOfficer = () => {
    axios.post(`${backendURL}/add-officer`, selectedOfficer)
    .then(() => {
        alert("✅ Officer added successfully");
        fetchOfficers();
        setShowModal(false);
      })
      .catch((error) => {
        console.error("❌ Add Officer Error:", error);
        alert("❌ Failed to add officer");
      });
  };
  
  // Edit Officer Function
  const handleEditOfficer = () => {
    axios.put(`${backendURL}/update-officer/${selectedOfficer.id}`, selectedOfficer)
    .then(() => {
        alert("✅ Officer updated successfully");
        fetchOfficers();  // Refresh the officers list
        setShowModal(false);  // Close the modal
      })
      .catch((error) => {
        console.error("❌ Update Officer Error:", error);
        alert("❌ Failed to update officer");
      });
  };
  
  const handleDeleteOfficer = (id) => {
    if (window.confirm("Are you sure you want to delete this officer?")) {
      axios.delete(`${backendURL}/delete-officer/${id}`)
      .then(() => {
          alert("✅ Officer deleted successfully");
          fetchOfficers();  // Refresh the officers list
        })
        .catch((error) => {
          console.error("❌ Delete Officer Error:", error);
          alert("❌ Failed to delete officer");
        });
    }
  };

  // Combined Modal Handler
  const handleAddOrEditOfficer = () => {
    if (modalType === "add") {
      handleAddOfficer();
    } else if (modalType === "edit") {
      handleEditOfficer();
    }
  };
  

  const filteredOfficers = officers.filter((officer) =>
    `${officer.firstName} ${officer.middleInitial}. ${officer.lastName} ${officer.role} ${officer.purok} ${officer.gender}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (type, officer = null) => {
    setModalType(type);
    setSelectedOfficer({
      id: officer?.id || "",  // Add default ID value
      firstName: officer?.firstName || "",
      lastName: officer?.lastName || "",
      middleInitial: officer?.middleInitial || "",
      gender: officer?.gender || "",
      age: officer?.age || "",
      birthDate: officer?.birthDate || "",
      birthPlace: officer?.birthPlace || "",
      purok: officer?.purok || "",
      street: officer?.street || "",
      barangay: officer?.barangay || "",  // Add default Barangay value
      citizenship: officer?.citizenship || "",
      civilStatus: officer?.civilStatus || "",
      religion: officer?.religion || "",
      occupation: officer?.occupation || "",
      email: officer?.email || "",
      contactNumber: officer?.contactNumber || "",
      annualIncome: officer?.annualIncome || "",
       beneficiaryStatus:officer?.beneficiaryStatus || "",
      role: officer?.role || "",
      status: officer?.status || "Active",
    });
    setShowModal(true);
  };


  const handleStatusChange = (id, newStatus) => {
    axios
      .put(`http://localhost:3000/update-officer/${id}`, { status: newStatus })
      .then(() => {
        alert("✅ Status updated successfully!");
        fetchOfficers(); // Refresh officers after update
      })
      .catch(() => alert("❌ Failed to update status"));
  };

  const handleRoleChange = (id, newRole) => {
    // Assuming you're calling this function when a role change occurs
    axios
      .put(`http://localhost:3000/update-officer/${id}`, { role: newRole })
      .then(() => {
        alert("✅ Officer's role updated successfully!");
        fetchOfficers(); // Refresh the list of officers after updating the role
      })
      .catch((error) => {
        console.error("❌ Failed to update role:", error);
        alert("❌ Failed to update role");
      });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token"); // Remove token if stored
      navigate("/auth"); // Redirect to login page
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOfficer(null);
    setModalType(""); // Reset modal type
  };

  const classifyIncome = (annualIncome) => {
    const monthlyIncome = annualIncome; // Convert to monthly income
  
    if (monthlyIncome < 21194) {
      return "Low Income";
    } else if (monthlyIncome < 43828) {
      return "Lower Middle Class";
    } else if (monthlyIncome < 76669) {
      return "Middle Class";
    } else if (monthlyIncome < 131484) {
      return "Upper Middle Class";
    } else if (monthlyIncome < 219140) {
      return "High Income (Not Rich)";
    } else {
      return "Rich";
    }
  };

  const downloadCSV = (type) => {
    const url = `http://localhost:3000/backup/${type}`;
    window.open(url, '_blank');
  };

  return (
    <div className="manage-officers">
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
          <div className="divider"></div> {/* Divider */}
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
        
          <div className="divider"></div> {/* Divider */}
          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1>Manage Officers</h1>
          <button className="add-btn" onClick={() => handleOpenModal("add")} aria-label="Add Officer">
            + Add Officer
          </button>
        </header>

      {/* Officer List Title */}
<h2 className="officer-list-title">Officer List</h2>

{/* 🔧 Toolbar with Search and Backup */}
<div className="toolbar">
 

  <input
    type="text"
    placeholder="Search by name or role..."
    className="search-bar"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

<button onClick={() => downloadCSV('officers')} className="btn">
    📥 Backup Officers CSV
  </button>
</div>


        {/* Officers Table */}
        <table className="officers-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>ID</th>
              <th>Full Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Purok</th>
              <th>Role</th>
              <th>Income Classification</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.map((officer) => (
              <tr key={officer.id}>
                <td className={officer.status === "Active" ? "status-active" : "status-inactive"}>
  <select
    value={officer.status}
    onChange={(e) => handleStatusChange(officer.id, e.target.value)}
  >
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </select>
</td>

                <td>{officer.id}</td>
                <td>{`${officer.firstName} ${officer.middleInitial}. ${officer.lastName}`}</td>
                <td>{officer.age}</td>
                <td>{officer.gender}</td>
                <td>{officer.purok}</td>
                
                <td>
                <select
                    value={officer.role}
                    onChange={(e) => handleRoleChange(officer.id, e.target.value)}
                  >
                    <option value="Barangay Captain">Barangay Captain</option>
                    <option value="Barangay Kagawad">Barangay Kagawad</option>
                    <option value="Barangay Secretary">Barangay Secretary</option>
                    <option value="Barangay Treasurer">Barangay Treasurer</option>
                    <option value="SK Chairman">SK Chairman</option>
                  </select>
                </td>
                <td>{classifyIncome(officer.annualIncome)}</td> {/* 🆕 Display income classification */}
                <td>
        <OfficerQRCode officer={officer} />
    </td>
                <td>
                  <button className="view-btn" onClick={() => handleOpenModal("view", officer)}>
                    👁 View
                  </button>
                  <button className="edit-btn" onClick={() => handleOpenModal("edit", officer)}>
                    ✏ Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteOfficer(officer.id)}>
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* View Resident Modal */}
{modalType === "view" && selectedOfficer && (
  <ViewOfficerModal
    isOpen={showModal}
    onClose={handleCloseModal}
    officer={selectedOfficer}
  />
)}

       {/* ✅ Conditionally Render ViewOfficerModal */}
{modalType === "view" && showModal && (
  <ViewOfficerModal officer={selectedOfficer} onClose={handleCloseModal} />
)}

{/* ✅ Render Only Edit/Add Modal */}
{showModal && selectedOfficer && modalType !== "view" && (
  <div className="modal">
    <div className="modal-content">
      <h2>{modalType === "edit" ? "Edit Officer" : "Add Officer"}</h2>
            <div className="form-grid">
              {Object.keys(selectedOfficer).map(
                (key) =>
                  key !== "status" && (
                    <div className="form-group" key={key}>
                      <label>{key.replace(/([A-Z])/g, " $1").trim()}</label>
                      {key === "gender" || key === "civilStatus" || key === "role" ? (
                        <select
                          value={selectedOfficer[key]}
                          disabled={modalType === "view"}
                          onChange={(e) =>
                            setSelectedOfficer({ ...selectedOfficer, [key]: e.target.value })
                          }
                        >
                          <option value="">Select {key}</option>
                          {key === "gender" ? (
                            <>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </>
                          ) : key === "civilStatus" ? (
                            <>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Widowed">Widowed</option>
                              <option value="Divorced">Divorced</option>
                            </>
                          ) : (
                            <>
                              <option value="Barangay Captain">Barangay Captain</option>
                              <option value="Barangay Kagawad">Barangay Kagawad</option>
                              <option value="Barangay Secretary">Barangay Secretary</option>
                              <option value="Barangay Treasurer">Barangay Treasurer</option>
                              <option value="SK Chairman">SK Chairman</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <input
                          type={key === "age" ? "number" : key === "birthDate" ? "date" : "text"}
                          value={selectedOfficer[key]}
                          onChange={(e) =>
                            setSelectedOfficer({ ...selectedOfficer, [key]: e.target.value })
                          }
                          disabled={modalType === "view"}
                        />
                      )}
                    </div>
                  )
              )}
            </div>

            <div className="modal-actions">
              {modalType !== "view" && (
                <button className="submit-btn" onClick={handleAddOrEditOfficer}>
                  {modalType === "edit" ? "Update" : "Submit"}
                </button>
              )}
              <button className="close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOfficers;