import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

const backendURL = 'http://192.168.56.237:5000';
const [collapsed, setCollapsed] = useState(false);



interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
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



export default function ManageResidents() {
   const [residents, setResidents] = useState<Resident[]>([]);
    const router = useRouter();
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [newResident, setNewResident] = useState<Resident>({
    
    id: '',
    firstName: '',
    lastName: '',
    middleInitial: '',
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
  axios.get(`${backendURL}/residents`)
    .then(response => setResidents(response.data))
    .catch(error => console.error('Error fetching residents:', error));
}, []);

  const handleChange = (key: keyof Resident, value: string) => {
    setNewResident(prev => ({ ...prev, [key]: value }));
  };


  const handleAddResident = async () => {
  try {
    const response = await axios.post(`${backendURL}/add-resident`, newResident);

    // Update residents list by adding the new resident
    setResidents(prev => [...prev, response.data]);

    // Show success message
    Alert.alert('Success', 'Resident added successfully!');

    // Reset the form fields to default values
    setNewResident({
      id: '',
      firstName: '',
      lastName: '',
      middleInitial: '',
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

    // Navigate to AdminDashboard after adding the resident
    router.push('/ManageResidents'); // Use the correct path for your AdminDashboard

  } catch (error) {
    console.error('Error adding resident:', error);
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

const handleEditOrUpdateResident = async () => {
  if (editingResident) {
    // If editing, update resident
    const updatedPayload = { ...editingResident, ...newResident };

    // Validate required fields before updating
    if (!updatedPayload.firstName || !updatedPayload.lastName) {
      console.error("First Name and Last Name are required");
      return;
    }

    try {
      const response = await axios.put(
        `${backendURL}/update-resident/${editingResident.id}`,
        updatedPayload
      );

      if (response.status === 200) {
        // Update resident list with the updated data
        const updatedList = residents.map((resident) =>
          resident.id === editingResident.id ? response.data.updatedResident : resident
        );

        setResidents(updatedList); // Update state with new resident data

        // Reset the form to empty values but keep the form visible
        setNewResident({} as Resident); // Clear the form fields
        setEditingResident(null); // Exit edit mode

        // Show success message
             Alert.alert('Success', 'Resident Updated successfully!');


        // Navigate back to the AdminDashboard screen (or ManageResidents page)
        router.push('/ManageResidents'); // Use the appropriate route path for your admin dashboard
      }
    } catch (error) {
      console.error("Error updating resident:", error);
    }
  } else {
    // If not editing, add new resident
    handleAddResident();
  }
};

// After clicking "Edit", load the resident data into the form
const handleEditResident = (resident: Resident) => {
  setNewResident(resident); // Load data into form
  setEditingResident(resident); // Enter edit mode
};

const handleDeleteResident = (id: string) => {
  // Show confirmation dialog before deletion
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this resident?',
    [
      {
        text: 'Cancel',
        style: 'cancel', // This button will not delete the resident
      },
      {
        text: 'Delete',
        style: 'destructive', // This button will delete the resident
        onPress: async () => {
          try {
            await axios.delete(`${backendURL}/delete-resident/${id}`);
            setResidents(residents.filter(r => r.id !== id)); // Remove the deleted resident from the list
            Alert.alert('Deleted', 'Resident deleted successfully.'); // Show success message
          } catch (error) {
            console.error('Error deleting resident:', error); // Log any errors
            Alert.alert('Error', 'There was an error deleting the resident.');
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
  {/* First row with Admin Dashboard and Manage Residents */}
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



      <Text style={styles.title}>Manage Residents</Text>

      {/* Add Resident Inputs */}
      {Object.keys(newResident).map((key) => (
        <TextInput
          key={key}
          placeholder={key.replace(/([A-Z])/g, ' \\$1')}
          value={(newResident as any)[key]}
          onChangeText={(value) => handleChange(key as keyof Resident, value)}
          style={styles.input}
        />
      ))}

      <TouchableOpacity
        onPress={handleEditOrUpdateResident}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {editingResident ? 'Update Resident' : 'Add Resident'}
        </Text>
      </TouchableOpacity>

      <View style={styles.residentList}>
        <Text style={styles.title}>Resident List</Text>
        {residents.map((resident, index) => (
  <View key={resident.id || `${resident.firstName}-${resident.lastName}-${index}`} style={styles.residentCard}>
    <Text style={styles.residentName}>
      {resident.firstName} {resident.lastName}
    </Text>
    <Text style={styles.residentDetails}>ID: {resident.id}</Text>
    <Text style={styles.residentDetails}>Age: {resident.age}</Text>
    <Text style={styles.residentDetails}>Gender: {resident.gender}</Text>
    <Text style={styles.residentDetails}>Street: {resident.street}</Text>
    <Text style={styles.residentDetails}>Purok: {resident.purok}</Text>
    <Text style={styles.residentDetails}>BirthDate: {resident.birthDate}</Text>
    <Text style={styles.residentDetails}>BirthPlace: {resident.birthPlace}</Text>
    <Text style={styles.residentDetails}>Barangay: {resident.barangay}</Text>
    <Text style={styles.residentDetails}>Citizenship: {resident.citizenship}</Text>
    <Text style={styles.residentDetails}>CivilStatus: {resident.civilStatus}</Text>
    <Text style={styles.residentDetails}>Religion: {resident.religion}</Text>
    <Text style={styles.residentDetails}>Occupation: {resident.occupation}</Text>
    <Text style={styles.residentDetails}>Email: {resident.email}</Text>
    <Text style={styles.residentDetails}>ContactNumber: {resident.contactNumber}</Text>
    <Text style={styles.residentDetails}>AnnualIncome: {resident.annualIncome}</Text>
    <Text style={styles.residentDetails}>BeneficiaryStatus: {resident.beneficiaryStatus}</Text>
    <Text style={styles.residentDetails}>Status: {resident.status}</Text>
    <View style={styles.actionRow}>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => handleEditResident(resident)}
                  style={[styles.actionButton, { backgroundColor: '#4caf50' }]}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteResident(resident.id)}
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
  residentList: {
    marginTop: 30,
  },
  residentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  residentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  residentDetails: {
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
