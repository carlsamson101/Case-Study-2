  import React, { useEffect, useState } from "react";
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { useNavigate } from "react-router-dom";
  import Modal from "react-modal";
  import axios from "axios";
  import "./ManageResidents.css";
  import BarangayClearance from "./BarangayClearance"; // Import BarangayClearance modal
  import ViewResidentModal from "./ViewResidentModal"; // Import View Modal
  import ResidentQRCode from './ResidentQRCode'; // Adjust path as needed
  import { BASE_URL } from './config'; // Adjust path if needed


  Modal.setAppElement("#root");

  function ManageResidents() {
    const [residents, setResidents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "add", "edit", "view"
    const [selectedResident, setSelectedResident] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search input
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState("manage-residents");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [clearanceText] = useState("");
    const [isClearanceOpen, setIsClearanceOpen] = useState(false);
    const [selectedClearanceResident, setSelectedClearanceResident] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [setUploadedResidents] = useState([]);
    const [ setIsCsvModalOpen] = useState(false);
    const [userRole, setUserRole] = useState("");

    const backendURL = process.env.REACT_APP_BACKEND === 'mongo'
    ? 'http://localhost:5000'
    : 'http://localhost:3000';

    
    // ✅ Default resident structure for adding new residents
    const initialResident = {
      id: "", // ✅ Ensure ID is stored
      firstName: "",
      lastName: "",
      middleInitial: "",
      street: "",
      purok: "",
      gender: "",
      age: "",
      birthDate: "",
      birthPlace: "",
      barangay: "",
      citizenship: "",
      civilStatus: "",
      religion: "",
      occupation: "",
      email: "",
      contactNumber: "",
      annualIncome: "",
      beneficiaryStatus: "",
      status: "Active",
    };
    
    useEffect(() => {
      const role = localStorage.getItem("userRole");
      setUserRole(role);
  
      // Redirect if not admin or officer
      if (!role || (role !== "admin" && role !== "officer")) {
        navigate("/");
      }
    }, [navigate]);

    useEffect(() => {
      fetchResidents();
    }, []);


    // 🔍 Filter residents based on search input
    const filteredResidents = residents.filter((resident) =>
      `${resident.firstName} ${resident.middleInitial ? resident.middleInitial + ". " : ""}${resident.lastName} ${resident.purok}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) // Filter by search term
    );

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
    

    // Handle search input change
    const handleSearch = (event) => {
      setSearchTerm(event.target.value); // Update search term
    };

  // ✅ Fetch residents from the backend
  const fetchResidents = () => {
    axios
    //.get(`${backendURL}/residents`)
    .get(`${BASE_URL}/residents`)
      .then((response) => {
        console.log("📌 Residents Data Received:", response.data); // ✅ Debugging
        setResidents(response.data);
      })
      .catch((error) => {
        console.error("❌ Error Fetching Residents:", error);
        alert("❌ Failed to load residents");
      });
  };

  // ✅ Handle adding a new resident
  const handleAddResident = async () => {
    if (!selectedResident.id || !selectedResident.firstName || !selectedResident.lastName) {
      alert("⚠ Please fill in all required fields.");
      return;
    }

    const newResident = { ...selectedResident };
    console.log("🆕 Sending Resident Data:", newResident); // Debugging

    try {
      const response = await axios.post(`${backendURL}/add-resident`, newResident);
      console.log("✅ Resident Added Response:", response.data);
      
      alert("✅ Resident added successfully!");
      fetchResidents();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error Adding Resident:", error.response?.data || error);
      alert("❌ Failed to add resident");
    }
  };

  // ✅ Handle editing a resident
  const handleEditResident = async () => {
    try {
      if (!selectedResident.id || !selectedResident.firstName || !selectedResident.lastName) {
        alert("❌ Missing required fields for resident.");
        return;
      }

      // 🔥 Convert selectedResident to a valid object for Redis
      const updatedResident = Object.entries(selectedResident).reduce((acc, [key, value]) => {
        if (value !== "") acc[key] = value; // Ignore empty fields
        return acc;
      }, {});

      await axios.put(`${backendURL}/update-resident/${selectedResident.id}`, updatedResident);

      alert("✅ Resident updated successfully!");
      await fetchResidents(); // 🔄 Ensure the UI is updated
      setShowModal(false); // Close modal
    } catch (error) {
      console.error("❌ Error updating resident:", error);
      alert("❌ Failed to update resident");
    }
  };


    // ✅ Handle deleting a resident
    const handleDeleteResident = (id) => {
      if (!id) {
        alert("❌ Invalid resident ID.");
        return;
      }
    
      if (!window.confirm("⚠ Are you sure you want to delete this resident?")) return;
    
      axios
      .delete(`${backendURL}/delete-resident/${id}`)
      .then(() => {
          alert("✅ Resident deleted successfully");
          fetchResidents(); // Refresh the list after deletion
        })
        .catch((error) => {
          console.error("❌ Error deleting resident:", error);
          alert("❌ Failed to delete resident");
        });
    };
    

    // ✅ Handle status change (Active/Inactive)
    const handleStatusChange = (id, newStatus) => {
      axios
      .put(`${backendURL}/update-resident/${id}`, { status: newStatus })
      .then(() => {
          alert("✅ Status updated successfully!");
          fetchResidents(); // Refresh residents
        })
        .catch(() => alert("❌ Failed to update status"));
    };

    // ✅ Open the modal for add/edit/view
    const handleOpenModal = (type, resident = null) => {
      console.log("Opening modal:", type, resident); // 🔹 Debugging log
      setModalType(type);
      setSelectedResident(resident || initialResident);
      setShowModal(true);
    };
    
    

    const handleLogout = () => {
      if (window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token"); // Remove token if stored
        navigate("/auth"); // Redirect to login page
      }
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedResident(null);
      setModalType(""); // Reset modal type
    };
    
  
 // Function to handle CSV file selection
 const handleFileChange = (event) => {
  const file = event.target.files[0];
  setCsvFile(file);
  console.log("Selected File:", file); // Debugging log
};


// Function to upload CSV file and merge with existing residents
const handleUpload = async () => {
  if (!csvFile) {
    toast.error("Please select a CSV file first!");
    return;
  }

  const formData = new FormData();
  formData.append("file", csvFile);

  try {
    const response = await axios.post(`${backendURL}/residents/upload-csv`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Server Response:", response.data); // Debugging

    if (response.status === 200) {
      const newResidents = response.data.data || []; // Ensure we extract valid resident data

      setResidents((prevResidents) => [...prevResidents, ...newResidents]); // Append new data
      setUploadedResidents(newResidents); // Store uploaded residents separately
      setCsvFile(null); // Clear file selection
      toast.success("CSV file uploaded successfully!");

      setIsCsvModalOpen(false); // Close modal after upload
    } else {
      toast.error("Error processing CSV file!");
    }
  } catch (error) {
    console.error("Upload Error:", error); // Debugging

    if (error.response) {
      if (error.response.status === 409) {
        const duplicateIds = error.response.data.duplicateIds || [];
        alert(`Error: Some IDs are already in use.\nDuplicate IDs: ${duplicateIds.join(", ")}`);
      } else {
        toast.error(error.response.data.message || "Error uploading CSV!");
      }
    } else {
      toast.error("Server not responding. Check backend.");
    }
  }
};

const downloadCSV = (type) => {
  const url = `http://localhost:3000/backup/${type}`;
  window.open(url, '_blank');
};


    return (
      <div className="manage-residents">
  {/* Sidebar */}
  <aside className="sidebar">
        <h2>{userRole === "admin" ? "Admin Panel" : "Officer Panel"}</h2>
        <ul>
          {/* Admin sees Dashboard */}
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

          <div className="divider"></div> {/* Divider */}

          {/* Manage Residents (visible to both) */}
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

          {/* Admin-only options */}
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

          <div className="divider"></div> {/* Divider */}

          {/* Logout */}
          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </aside>



        {/* Main Content */}
        <div className="main-content">
          <header className="header">
            <h1>Manage Residents</h1>
            <button className="add-btn" onClick={() => handleOpenModal("add")}>
              + Add Resident
            </button>
          </header>

            

          {/* Resident List Title */}
          <h2 className="resident-list-title">Resident List</h2>

 {/* 🔎 Search & 📂 CSV Upload */}
<div className="search-upload-container">
  {/* 🔍 Search Bar */}
  <input
    type="text"
    placeholder="Search by name, purok..."
    className="search-bar"
    value={searchTerm}
    onChange={handleSearch} // ✅ Updates search term
  />

{/* 📂 Import CSV Button */}
<label className="csv-upload-btn">
  📂 Import CSV
  <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: "none" }} />
</label>


{/* Upload and Remove buttons (moved outside the label) */}
<button onClick={handleUpload} disabled={!csvFile}>Upload CSV</button>
<button onClick={() => downloadCSV('residents')} className="btn">📥 Backup Residents CSV</button>



</div>


          {/* Residents Table */}
          <table className="residents-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>ID</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Purok</th>
                <th>Barangay</th>
                <th>Income Classification</th>
                <th>QR Code</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
    {filteredResidents.map((resident) => (
      <tr key={resident.id}> {/* Use ID as key */}
        <td className={resident.status === "Active" ? "status-active" : "status-inactive"}>
          <select
            value={resident.status}
            onChange={(e) => handleStatusChange(resident.id, e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </td>
        <td>{resident.id}</td> {/* 🆔 Display ID */}
        <td>{`${resident.firstName} ${resident.middleInitial}. ${resident.lastName}`}</td>
        <td>{resident.age}</td>
        <td>{resident.gender}</td>
        <td>{resident.purok}</td>
        <td>{resident.barangay}</td>
        <td>{classifyIncome(resident.annualIncome)}</td> {/* 🆕 Display income classification */}
        <td>
        <ResidentQRCode resident={resident} />
    </td>

        <td>
        <button 
    onClick={() => {
      setSelectedClearanceResident(resident); // Set resident when clicking the button
      setIsClearanceOpen(true); // Open the modal
    }} 
    style={{ marginBottom: "10px" }}
  >
    Generate Barangay Clearance
  </button>

  <BarangayClearance 
    isOpen={isClearanceOpen} 
    onClose={() => setIsClearanceOpen(false)}
    resident={selectedClearanceResident}
  />
  <br></br>
  <button className="view-btn" onClick={() => handleOpenModal("view", resident)}>👁 View</button>
  <button className="edit-btn" onClick={() => handleOpenModal("edit", resident)}>✏ Edit</button>
          <button className="delete-btn" onClick={() => handleDeleteResident(resident.id)}>❌ Delete</button>
          


        {/* Barangay Clearance Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Barangay Clearance Preview"
          style={{
            content: { width: "100px", margin: "auto", padding: "20px", textAlign: "center" },
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          }}
        >
          <h2>Barangay Clearance</h2>
          <hr />
          <pre style={{ textAlign: "left", fontFamily: "monospace" }}>{clearanceText}</pre>

          <button onClick={() => window.print()} style={{ marginTop: "20px" }}>
            Print Clearance
          </button>
          <button onClick={() => setModalIsOpen(false)} style={{ marginLeft: "10px" }}>
            Close
          </button>
        </Modal>
        </td>
      </tr>
    ))}
  </tbody>

          </table>

         

              {/* View Resident Modal */}
  {modalType === "view" && selectedResident && (
    <ViewResidentModal
      isOpen={showModal}
      onClose={handleCloseModal}
      resident={selectedResident}
    />
  )}

    
        </div>

      {/* ✅ Conditionally Render ViewResidentModal */}
  {modalType === "view" && showModal && (
    <ViewResidentModal resident={selectedResident} onClose={handleCloseModal} />
  )}

  {/* ✅ Render Only Edit/Add Modal */}
  {showModal && selectedResident && modalType !== "view" && (
    <div className="modal">
      <div className="modal-content">
        <h2>{modalType === "edit" ? "Edit Resident" : "Add Resident"}</h2>

        <div className="form-grid">
          {Object.keys(selectedResident).map(
            (key) =>
              key !== "status" && (
                <div className="form-group" key={key}>
                  <label>{key.replace(/([A-Z])/g, " $1").trim()}</label>
                  {key === "gender" || key === "civilStatus" ? (
                    <select
                      value={selectedResident[key]}
                      onChange={(e) =>
                        setSelectedResident({ ...selectedResident, [key]: e.target.value })
                      }
                    >
                      <option value="">Select {key}</option>
                      {key === "gender" ? (
                        <>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </>
                      ) : (
                        <>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Divorced">Divorced</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <input
                      type={key === "age" ? "number" : key === "birthDate" ? "date" : "text"}
                      value={selectedResident[key]}
                      onChange={(e) =>
                        setSelectedResident({ ...selectedResident, [key]: e.target.value })
                      }
                    />
                  )}
                </div>
              )
          )}
        </div>

              <div className="modal-actions">
    {modalType === "add" && (
      <button className="submit-btn" onClick={handleAddResident}>
        Submit
      </button>
    )}
    {modalType === "edit" && (
      <button className="submit-btn" onClick={handleEditResident}>
        Update
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

  export default ManageResidents;