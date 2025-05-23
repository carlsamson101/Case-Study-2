import { useEffect, useState } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

import "./AdminDashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend, Defs, LinearGradient, LineChart, Line } from "recharts";

function AdminDashboard() {
  const [userCounts, setUserCounts] = useState({ residentsCount: 0, officersCount: 0 });
  const [viewCount, setViewCount] = useState(0);
  const [error, setError] = useState("");
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [populationByGender, setPopulationByGender] = useState([]);
  const [purokDistribution, setPurokDistribution] = useState([]);
  const [residents, setResidents] = useState([]);
  const [civilStatusDistribution, setCivilStatusDistribution] = useState([]);
  const [incomeClassification, setIncomeClassification] = useState({ low: 0, middle: 0, high: 0 });

  
  const backendURL = process.env.REACT_APP_BACKEND === 'mongo'
  ? 'http://localhost:5000'
  : 'http://localhost:3000';


  const [officers, setOfficers] = useState([]);

  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState("admin-dashboard");
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6699"];

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("token");
      navigate("/auth");
    }
  };
  

  

  useEffect(() => {
    fetchUserCounts();
    fetchHomePageViews();
    fetchResidents();
    fetchOfficers();
    fetchResidentsAndOfficers();

  }, []);

  useEffect(() => {
    if (residents.length || officers.length) {
      const allUsers = [...residents, ...officers];
      setAgeDistribution(getAgeDistribution(allUsers));
      setPopulationByGender(getPopulationByGender(allUsers));
      setPurokDistribution(getPurokDistribution(allUsers));
      setCivilStatusDistribution(getCivilStatusDistribution(allUsers));

    }
  }, [residents, officers]);

  const fetchUserCounts = () => {
    axios
    .get(`${backendURL}/user-counts`)
      .then((response) => setUserCounts(response.data))
      .catch((error) => {
        console.error("Error fetching user counts:", error);
        setError("❌ Failed to load user counts");
      });
  };

  const fetchHomePageViews = () => {
    axios
    .get(`${backendURL}/home-views`)
      .then((response) => setViewCount(response.data.views))
      .catch((error) => {
        setError("❌ Failed to load view count");
        console.error("Error fetching view count:", error);
      });
  };



  const fetchResidents = () => {
    axios
    .get(`${backendURL}/residents`)
      .then((response) => setResidents(response.data))
      .catch((error) => console.error("Error fetching residents:", error));
  };

  const fetchOfficers = () => {
    axios
    .get(`${backendURL}/officers`)
      .then((response) => setOfficers(response.data))
      .catch((error) => console.error("Error fetching officers:", error));
  };

  // 📊 Age Distribution
  const getAgeDistribution = (users) => {
    const ageCount = users.reduce((acc, user) => {
      acc[user.age] = (acc[user.age] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(ageCount).map(age => ({
      name: age,
      count: ageCount[age]
    }));
  };

  // 📈 Population by Gender
  const getPopulationByGender = (users) => {
    const genderCount = users.reduce((acc, user) => {
      acc[user.gender] = (acc[user.gender] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(genderCount).map(gender => ({
      name: gender,
      count: genderCount[gender]
    }));
  };

  // 🌍 Purok Distribution
  const getPurokDistribution = (users) => {
    const purokCount = users.reduce((acc, user) => {
      acc[user.purok] = (acc[user.purok] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(purokCount).map(purok => ({
      name: purok,
      count: purokCount[purok]
    }));
  };

  const getCivilStatusDistribution = (users) => {
    const statusCount = users.reduce((acc, user) => {
      acc[user.civilStatus] = (acc[user.civilStatus] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(statusCount).map(status => ({
      name: status,
      count: statusCount[status]
    }));
  };

  const fetchResidentsAndOfficers = async () => {
    try {
      const [residentsRes, officersRes] = await Promise.all([
        axios.get(`${backendURL}/residents`),  // Fix here: Use axios.get
        axios.get(`${backendURL}/officers`)   // Fix here: Use axios.get
      ]);
  
      const residentsData = residentsRes.data;
      const officersData = officersRes.data;
  
      setResidents(residentsData);
      setOfficers(officersData);
  
      // ✅ Count 4Ps Beneficiaries (Residents + Officers)
      const fourPsResidents = residentsData.filter(resident => resident.beneficiaryStatus === "4Ps").length;
      const fourPsOfficers = officersData.filter(officer => officer.beneficiaryStatus === "4Ps").length;
      const totalFourPsCount = fourPsResidents + fourPsOfficers;
  
      // ✅ Income Classification based on PIDS
      const incomeCounts = {
        "Low Income": 0,
        "Lower Middle Class": 0,
        "Middle Class": 0,
        "Upper Middle Class": 0,
        "High Income (Not Rich)": 0,
        "Rich": 0,
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
  
      // Classify income for both Residents & Officers
      [...residentsData, ...officersData].forEach(person => {
        const category = classifyIncome(person.annualIncome);
        incomeCounts[category]++;
      });
  
      setIncomeClassification(incomeCounts);
  
      setUserCounts((prevCounts) => ({
        ...prevCounts,
        residentsCount: residentsData.length,
        officersCount: officersData.length,
        fourPsCount: totalFourPsCount,
      }));
    } catch (error) {
      console.error("Error fetching residents and officers:", error);
    }
  };
  
  


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

      <div className="main-content">
        <header className="header"><h1>Admin Dashboard</h1></header>

        <div className="stats-summary">
          <div className="stats-column"><span>{userCounts.residentsCount + userCounts.officersCount}</span><p>👥Total Individuals</p></div>
          <div className="stats-column">
  <Link to="/manage-residents" className="stats-link">
    <span>{userCounts.residentsCount}</span>
    <p>🏡 Residents</p>
  </Link>
</div>

<div className="stats-column">
  <Link to="/manage-officers" className="stats-link"> 
    <span>{userCounts.officersCount}</span>
    <p>👮 Barangay Officers</p>
  </Link>
</div>

<div className="stats-column">
  <Link to="/manage-reports" className="stats-link">
    <span>{userCounts.reportsCount}</span>
    <p>📄 Barangay Reports</p>
  </Link>
</div>


        </div>

        <div className="graphs-section">
        <div className="charts-container two-columns">
        <div className="chart-item">
          <h2>📊 Age Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie 
      data={ageDistribution} 
      dataKey="count" 
      nameKey="name" 
      cx="50%" 
      cy="50%" 
      outerRadius={100} 
      label
    >
      {ageDistribution.map((_, index) => (
        <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 50%)`} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h2>📊 Population by Gender</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={populationByGender}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h2>🌍 Purok Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <defs>
      {purokDistribution.map((_, index) => (
        <linearGradient key={index} id={`purokGradient${index}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${index * 40}, 70%, 60%)`} stopOpacity={1} />
          <stop offset="100%" stopColor={`hsl(${index * 40}, 80%, 40%)`} stopOpacity={1} />
        </linearGradient>
      ))}
    </defs>
    <Pie data={purokDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
      {purokDistribution.map((_, index) => (
        <Cell key={`cell-${index}`} fill={`url(#purokGradient${index})`} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
        </div>

        <div className="chart-item">
          <h2>📌 Civil Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={civilStatusDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div className="graphs-section">
  <div className="charts-container two-columns">
    {/* 📊 Income Classification Graph */}
    <div className="chart-item">
      <h2>💰 Income Classification</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={Object.entries(incomeClassification).map(([name, count]) => ({ name, count }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#FF5733" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* 🔢 4Ps Beneficiaries Counter */}
    <div className="chart-item fourPs-counter">
      <h2>🟢 4Ps Beneficiaries</h2>
      <div className="fourPs-box">
        <span className="fourPs-number">{userCounts.fourPsCount}</span>
        <p>Total Beneficiaries</p>
      </div>
    </div>
  </div>
</div>

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default AdminDashboard;
