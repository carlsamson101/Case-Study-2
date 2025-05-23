import React from "react";
import QRCode from "react-qr-code";

const ResidentQRCode = ({ resident }) => {
  const qrValue = `
ID: ${resident.id}
Name: ${resident.firstName} ${resident.middleInitial}. ${resident.lastName}
Street: ${resident.street}
Purok: ${resident.purok}
Gender: ${resident.gender}
Age: ${resident.age}
Birth Date: ${resident.birthDate}
Birth Place: ${resident.birthPlace}
Barangay: ${resident.barangay}
Citizenship: ${resident.citizenship}
Civil Status: ${resident.civilStatus}
Religion: ${resident.religion}
Occupation: ${resident.occupation}
Email: ${resident.email}
Contact Number: ${resident.contactNumber}
Annual Income: ${resident.annualIncome}
Beneficiary Status: ${resident.beneficiaryStatus}
Status: ${resident.status}
`.trim(); // Remove leading/trailing blank lines

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <QRCode value={qrValue} size={150} />
      <p>{resident.firstName} {resident.lastName}</p>
    </div>
  );
};

export default ResidentQRCode;