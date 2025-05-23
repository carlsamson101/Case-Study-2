import React from "react";
import QRCode from "react-qr-code";

const OfficerQRCode = ({ officer }) => {
  const qrValue = `
ID: ${officer.id}
Name: ${officer.firstName} ${officer.middleInitial}. ${officer.lastName}
Street: ${officer.street}
Purok: ${officer.purok}
Gender: ${officer.gender}
Age: ${officer.age}
Birth Date: ${officer.birthDate}
Birth Place: ${officer.birthPlace}
Barangay: ${officer.barangay}
Citizenship: ${officer.citizenship}
Civil Status: ${officer.civilStatus}
Religion: ${officer.religion}
Occupation: ${officer.occupation}
Email: ${officer.email}
Contact Number: ${officer.contactNumber}
Annual Income: ${officer.annualIncome}
Beneficiary Status: ${officer.beneficiaryStatus}
Status: ${officer.status}
`.trim(); // Remove leading/trailing blank lines

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <QRCode value={qrValue} size={150} />
      <p>{officer.firstName} {officer.lastName}</p>
    </div>
  );
};

export default OfficerQRCode;