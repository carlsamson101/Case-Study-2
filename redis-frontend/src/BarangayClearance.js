import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import styles from "./BarangayClearance.module.css";
import blogo from "../src/blogo.jpg"; // Import the logo

Modal.setAppElement("#root");

const BarangayClearance = ({ isOpen, onClose, resident }) => {
    const [clearance, setClearance] = useState(null);
    const [error, setError] = useState("");

    const backendURL = process.env.REACT_APP_BACKEND === 'mongo'
    ? 'http://localhost:5000'
    : 'http://localhost:3000';

       // Ensure resident is defined before accessing properties
       if (!isOpen || !resident) return null;

       // Fetch Barangay Clearance
       const generateClearance = async () => {
           try {
               setError("");
               console.log("Fetching clearance for residentId:", resident.id);
   
               const response = await axios.post(`${backendURL}/api/generate-clearance`, { residentId: resident.id });
               
               console.log("Clearance received:", response.data);
               setClearance(response.data); // Store clearance data
           } catch (err) {
               console.error("Error generating clearance:", err.response?.data || err);
               setError(err.response?.data?.error || "Error generating clearance");
           }
       };

       const handleClose = () => {
        onClose(); // Close the modal
        setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 100); // Small delay ensures modal closes before refresh
      };
    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Barangay Clearance" className={styles.modalOverlay}>
        <div className={styles.modalContent}>
            {!clearance ? (
                <div className={styles.form}>
                    <h2 className={styles.modalTitle}>Generate Barangay Clearance</h2>
                    <p className={styles.residentId}><strong>Resident ID:</strong> {resident.id}</p>
                    <button className={`${styles.btn} ${styles.generateBtn}`} onClick={generateClearance}>Generate</button>
                </div>
            ) : (
                <div className={styles.clearanceDocument}>
                    <header className={styles.headerSection}>
                        <img src={blogo} alt="Barangay Logo" className={styles.logo} />
                        <div className={styles.headerText}>
                            <p>Republic of the Philippines</p>
                            <p>Province of Lanao Del Norte</p>
                            <p>Municipality of Iligan City</p>
                            <h2 className={styles.barangayName}>Barangay Dalipuga</h2>
                        </div>
                    </header>
                    
                    <h3 className={styles.clearanceTitle}>BARANGAY CLEARANCE</h3>
                    <p className={styles.toWhom}>TO WHOM IT MAY CONCERN:</p>
                    <p className={styles.certifyText}>
                        This is to certify that <strong>{clearance.fullName}</strong>, {clearance.age ? ` ${clearance.age} years old,` : " Age not available,"}  
                        and a resident of Barangay Dalipuga, Iligan City, is known to be of good  
                        moral character and a law-abiding citizen of the community.
                    </p>
                    <p className={styles.certifyText}>
                        To certify further, that he/she has no derogatory and/or criminal records filed in this barangay.
                    </p>
                    <p className={styles.issuedDate}>
                        ISSUED this <strong>{clearance.issuedDate}</strong> at Barangay Dalipuga, Iligan City,  
                        upon request of the interested party for whatever legal purpose it may serve.
                    </p>
                    <p className={styles.captainSignature}><u>Nilda C. Hamoy</u></p>
                    <p className={styles.captainTitle}>Barangay Captain</p>
    
                    <div className={styles.documentFooter}>
                        <p>O.R. No: <span>_____________</span></p>
                        <p>Date Issued: <span>{clearance.issuedDate}</span></p>
                        <p>Doc. Stamp: Paid</p>
                    </div>
                    <button className={`${styles.btn} ${styles.printBtn}`} onClick={() => window.print()}>Print</button>
                </div>
            )}
            
            <button className={`${styles.btn} ${styles.closeBtn}`} onClick={handleClose}>Close</button>
        </div>
    </Modal>
    
    );
};


export default BarangayClearance;
