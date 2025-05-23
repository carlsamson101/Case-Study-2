import React, { useState } from "react";
import Modal from "react-modal";
import maleAvatar from "../src/male-avatar.png"; // Default male image
import femaleAvatar from "../src/female-avatar.png"; // Default female image
import styles from "./ViewOfficerModal.module.css"; // Import CSS module

const ViewOfficerModal = ({ isOpen, onClose, officer }) => {
  const [activeTab, setActiveTab] = useState("general");

  if (!officer) return null;

  const profileImage = officer.gender === "Male" ? maleAvatar : femaleAvatar;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Officer Information</h2>
        <div className={styles.officerProfile}>
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
          <div className={styles.profileDetails}>
            <h3>{officer.firstName} {officer.lastName}</h3>
            <p><strong>Age:</strong> {officer.age}</p>
            <p><strong>Birthday:</strong> {officer.birthDate}</p>
            <p><strong>Email:</strong> {officer.email || "N/A"}</p>
            <p><strong>Status:</strong> {officer.status}</p>
          </div>
        </div>

        <div className={styles.tabs}>
          <button onClick={() => setActiveTab("general")} className={activeTab === "general" ? styles.active : ""}>General Info</button>
          <button onClick={() => setActiveTab("address")} className={activeTab === "address" ? styles.active : ""}>Address</button>
          <button onClick={() => setActiveTab("contact")} className={activeTab === "contact" ? styles.active : ""}>Contact</button>
          <button onClick={() => setActiveTab("documents")} className={activeTab === "documents" ? styles.active : ""}>Socioeconomic Information</button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "general" && (
            <div className={styles.infoSection}>
              <p><strong>Position:</strong> {officer.role}</p>
              <p><strong>Gender:</strong> {officer.gender}</p>
              <p><strong>Citizenship:</strong> {officer.citizenship}</p>
              <p><strong>Occupation:</strong> {officer.occupation || "N/A"}</p>
              <p><strong>Religion:</strong> {officer.religion || "N/A"}</p>
              <p><strong>Civil Status:</strong> {officer.civilStatus}</p>
              <p><strong>Birth Place:</strong> {officer.birthPlace}</p>
              
            </div>
          )}

          {activeTab === "address" && (
            <div className={styles.infoSection}>
              <p><strong>Barangay:</strong> {officer.barangay}</p>
              <p><strong>Purok:</strong> {officer.purok}</p>
            </div>
          )}

          {activeTab === "contact" && (
            <div className={styles.infoSection}>
              <p><strong>Phone:</strong> {officer.contactNumber || "N/A"}</p>
            </div>
          )}

          {activeTab === "documents" && (
                      <div className={styles.infoSection}>
                         <p><strong>Annual Income:</strong> {officer.annualIncome || "N/A"}</p>
                         <p><strong>Beneficiary Status :</strong> {officer.beneficiaryStatus|| "N/A"}</p>
                      </div>
                    )}
                  </div>

        <button className={styles.closeBtn} onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default ViewOfficerModal;
