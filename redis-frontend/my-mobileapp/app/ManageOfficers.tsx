import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

const backendURL = 'http://192.168.56.237:5000';


interface Officer {
  id: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  role: string;
  street: string;
  purok: string;
  gender: string;
  age: string;
  birthDate: string;
  birthPlace: string;
  barangay: string;
  citizenship: string;
  civilStatus: string;
  religion: string;
  occupation: string;
  email: string;
  contactNumber: string;
  annualIncome: string;
  beneficiaryStatus: string;
  status: string;
}



export default function ManageOfficers() {
  const [Officers, setOfficers] = useState<Officer[]>([]);
  const router = useRouter();
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [newOfficer, setNewOfficer] = useState<Officer>({
    
    id: '',
    firstName: '',
    lastName: '',
    middleInitial: '',
    role: '',
    street: '',
    purok: '',
    gender: '',
    age: '',
    birthDate: '',
    birthPlace: '',
    barangay: 'Dalipuga',
    citizenship: 'Filipino',
    civilStatus: '',
    religion: '',
    occupation: '',
    email: '',
    contactNumber: '',
    annualIncome: '',
    beneficiaryStatus: '',
    status: 'Active',
  });

 useEffect(() => {
  axios.get(`${backendURL}/Officers`)
    .then(response => setOfficers(response.data))
    .catch(error => console.error('Error fetching Officers:', error));
}, []);

  const handleChange = (key: keyof Officer, value: string) => {
    setNewOfficer(prev => ({ ...prev, [key]: value }));
  };


  const handleAddOfficer = async () => {
  try {
    const response = await axios.post(`${backendURL}/add-Officer`, newOfficer);

    // Update Officers list by adding the new Officer
    setOfficers(prev => [...prev, response.data]);

    // Show success message
    Alert.alert('Success', 'Officer added successfully!');

    // Reset the form fields to default values
    setNewOfficer({
      id: '',
      firstName: '',
      lastName: '',
      middleInitial: '',
      role: '',
      street: '',
      purok: '',
      gender: '',
      age: '',
      birthDate: '',
      birthPlace: '',
      barangay: '',
      citizenship: '',
      civilStatus: '',
      religion: '',
      occupation: '',
      email: '',
      contactNumber: '',
      annualIncome: '',
      beneficiaryStatus: '',
      status: 'Active',
    });

    // Navigate to AdminDashboard after adding the Officer
    router.push('/ManageOfficers'); // Use the correct path for your AdminDashboard

  } catch (error) {
    console.error('Error adding Officer:', error);
  }
};

const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: () => {
          // Clear tokens/session if needed
          router.replace('/Login');
        },
      },
    ]);
  };

const handleEditOrUpdateOfficer = async () => {
  if (editingOfficer) {
    // If editing, update Officer
    const updatedPayload = { ...editingOfficer, ...newOfficer };

    // Validate required fields before updating
    if (!updatedPayload.firstName || !updatedPayload.lastName) {
      console.error("First Name and Last Name are required");
      return;
    }

    try {
      const response = await axios.put(
        `${backendURL}/update-Officer/${editingOfficer.id}`,
        updatedPayload
      );

      if (response.status === 200) {
        // Update Officer list with the updated data
        const updatedList = Officers.map((Officer) =>
          Officer.id === editingOfficer.id ? response.data.updatedOfficer : Officer
        );

        setOfficers(updatedList); // Update state with new Officer data

        // Reset the form to empty values but keep the form visible
        setNewOfficer({} as Officer); // Clear the form fields
        setEditingOfficer(null); // Exit edit mode

        // Show success message
             Alert.alert('Success', 'Officer Updated successfully!');


        // Navigate back to the AdminDashboard screen (or ManageOfficers page)
        router.push('/ManageOfficers'); // Use the appropriate route path for your admin dashboard
      }
    } catch (error) {
      console.error("Error updating Officer:", error);
    }
  } else {
    // If not editing, add new Officer
    handleAddOfficer();
  }
};

// After clicking "Edit", load the Officer data into the form
const handleEditOfficer = (Officer: Officer) => {
  setNewOfficer(Officer); // Load data into form
  setEditingOfficer(Officer); // Enter edit mode
};

const handleDeleteOfficer = (id: string) => {
  // Show confirmation dialog before deletion
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this Officer?',
    [
      {
        text: 'Cancel',
        style: 'cancel', // This button will not delete the Officer
      },
      {
        text: 'Delete',
        style: 'destructive', // This button will delete the Officer
        onPress: async () => {
          try {
            await axios.delete(`${backendURL}/delete-Officer/${id}`);
            setOfficers(Officers.filter(r => r.id !== id)); // Remove the deleted Officer from the list
            Alert.alert('Deleted', 'Officer deleted successfully.'); // Show success message
          } catch (error) {
            console.error('Error deleting Officer:', error); // Log any errors
            Alert.alert('Error', 'There was an error deleting the Officer.');
          }
        },
      },
    ],
    { cancelable: true } // Allows dismissing the alert by tapping outside of it
  );
};

  return (

    
    <ScrollView style={styles.container}>

        {/* Header Section */}

  {/* Navigation Buttons in Header */}
 <View style={styles.headerNav}>
  {/* First row with Admin Dashboard and Manage Officers */}
  <View style={styles.row}>
    <Button title="Admin Dashboard" onPress={() => router.push('/AdminDashboard')} />
    <Button title="Manage Residents" onPress={() => router.push('/ManageResidents')} />
  </View>

  {/* Second row with Manage Officers and Logout */}
  <View style={styles.row}>
    <Button title="Manage Officers" onPress={() => router.push('/ManageOfficers')} />
    <Button title="Logout" onPress={handleLogout} />
  </View>
</View>



      <Text style={styles.title}>Manage Officers</Text>

      {/* Add Officer Inputs */}
      {Object.keys(newOfficer).map((key) => (
        <TextInput
          key={key}
          placeholder={key.replace(/([A-Z])/g, ' \\$1')}
          value={(newOfficer as any)[key]}
          onChangeText={(value) => handleChange(key as keyof Officer, value)}
          style={styles.input}
        />
      ))}

      <TouchableOpacity
        onPress={handleEditOrUpdateOfficer}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {editingOfficer ? 'Update Officer' : 'Add Officer'}
        </Text>
      </TouchableOpacity>

      <View style={styles.OfficerList}>
        <Text style={styles.title}>Officer List</Text>
        {Officers.map((Officer, index) => (
  <View key={Officer.id || `${Officer.firstName}-${Officer.lastName}-${index}`} style={styles.OfficerCard}>
    <Text style={styles.OfficerName}>
      {Officer.firstName} {Officer.lastName}
    </Text>
    <Text style={styles.OfficerDetails}>ID: {Officer.id}</Text>
    <Text style={styles.OfficerDetails}>Role: {Officer.role}</Text>
    <Text style={styles.OfficerDetails}>Age: {Officer.age}</Text>
    <Text style={styles.OfficerDetails}>Gender: {Officer.gender}</Text>
    <Text style={styles.OfficerDetails}>Street: {Officer.street}</Text>
    <Text style={styles.OfficerDetails}>Purok: {Officer.purok}</Text>
    <Text style={styles.OfficerDetails}>BirthDate: {Officer.birthDate}</Text>
    <Text style={styles.OfficerDetails}>BirthPlace: {Officer.birthPlace}</Text>
    <Text style={styles.OfficerDetails}>Barangay: {Officer.barangay}</Text>
    <Text style={styles.OfficerDetails}>Citizenship: {Officer.citizenship}</Text>
    <Text style={styles.OfficerDetails}>CivilStatus: {Officer.civilStatus}</Text>
    <Text style={styles.OfficerDetails}>Religion: {Officer.religion}</Text>
    <Text style={styles.OfficerDetails}>Occupation: {Officer.occupation}</Text>
    <Text style={styles.OfficerDetails}>Email: {Officer.email}</Text>1
    <Text style={styles.OfficerDetails}>ContactNumber: {Officer.contactNumber}</Text>
    <Text style={styles.OfficerDetails}>AnnualIncome: {Officer.annualIncome}</Text>
    <Text style={styles.OfficerDetails}>BeneficiaryStatus: {Officer.beneficiaryStatus}</Text>
    <Text style={styles.OfficerDetails}>Status: {Officer.status}</Text>
    <View style={styles.actionRow}>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => handleEditOfficer(Officer)}
                  style={[styles.actionButton, { backgroundColor: '#4caf50' }]}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteOfficer(Officer.id)}
                  style={[styles.actionButton, { backgroundColor: '#e57373' }]}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  OfficerList: {
    marginTop: 30,
  },
  OfficerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  OfficerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  OfficerDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,  // Ensure this line has a valid value
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#fff',
  },
  toggleButton: {
  position: 'absolute',
  top: 10,
  right: 10, // Keep right padding within available width
  zIndex: 10,
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
},

  dashboardContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f6f8',
  },
  sidebar: {
    width: 220,
    backgroundColor: '#333',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  activeItem: {
    backgroundColor: '#555',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#555',
    marginVertical: 15,
  },
  logout: {
    borderBottomWidth: 0,
    marginTop: 20,
  },
  mainContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statsColumn: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statsLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    textAlign: 'center',
  },
  graphsSection: {
    marginBottom: 20,
  },
  chartsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chartItem: {
    width: '48%', // Adjust for spacing if needed
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
    textAlign: 'center',
  },
  fourPsCounter: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150, // Adjust as needed
  },
  fourPsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  fourPsLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  sidebarCollapsed: {
    width: 50,
  },


logo: {
  fontSize: 20,
  fontWeight: 'bold',
  color: 'white',
},

 headerNav: {
    padding: 10,
  },
  row: {
    flexDirection: 'row', // Arranges buttons horizontally
    justifyContent: 'space-between', // Spreads them out evenly
    marginBottom: 10, // Adds space between rows
  },

});
