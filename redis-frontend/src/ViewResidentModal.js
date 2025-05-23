import React, { useState } from "react";
import Modal from "react-modal";
import maleAvatar from "../src/male-avatar.png"; // Default male image
import femaleAvatar from "../src/female-avatar.png"; // Default female image
import styles from "./ViewResidentModal.module.css"; // Import CSS module

const ViewResidentModal = ({ isOpen, onClose, resident }) => {
  const [activeTab, setActiveTab] = useState("general");

  if (!resident) return null;

  const profileImage = resident.gender === "Male" ? maleAvatar : femaleAvatar;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Resident Information</h2>
        <div className={styles.residentProfile}>
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
          <div className={styles.profileDetails}>
            <h3>{resident.firstName} {resident.lastName}</h3>
            <p><strong>Age:</strong> {resident.age}</p>
            <p><strong>Birthday:</strong> {resident.birthDate}</p>
            <p><strong>Email:</strong> {resident.email || "N/A"}</p>
            <p><strong>Status:</strong> {resident.status}</p>

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
              <p><strong>Gender:</strong> {resident.gender}</p>
              <p><strong>Citizenship:</strong> {resident.citizenship}</p>
              <p><strong>Occupation:</strong> {resident.occupation || "N/A"}</p>
              <p><strong>Religion:</strong> {resident.religion || "N/A"}</p>
              <p><strong>Civil Status:</strong> {resident.civilStatus}</p>
              <p><strong>Birth Place:</strong> {resident.birthPlace}</p>
            </div>
          )}

          {activeTab === "address" && (
            <div className={styles.infoSection}>
              <p><strong>Street:</strong> {resident.street}</p>
              <p><strong>Barangay:</strong> {resident.barangay}</p>
              <p><strong>Purok:</strong> {resident.purok}</p>
            </div>
          )}

          {activeTab === "contact" && (
            <div className={styles.infoSection}>
              <p><strong>Phone:</strong> {resident.contactNumber || "N/A"}</p>
            </div>
          )}

          {activeTab === "documents" && (
            <div className={styles.infoSection}>
               <p><strong>Annual Income:</strong> {resident.annualIncome || "N/A"}</p>
               <p><strong>Beneficiary Status :</strong> {resident.beneficiaryStatus|| "N/A"}</p>
            </div>
          )}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default ViewResidentModal;
