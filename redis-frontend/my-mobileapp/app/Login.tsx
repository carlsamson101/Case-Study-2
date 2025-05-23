import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface FormData {
  username: string;
  password: string;
}



export default function AuthPage() {


  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    try {
      // Use your local IP address or ngrok for mobile
      const backendURL = "http://192.168.56.237:5000";
      const response = await axios.post(`${backendURL}/Login`, formData, {
        withCredentials: true,
      });

      const role = response.data.role;
      // Navigate based on role
      if (role === 'admin') router.push('/AdminDashboard');
    } catch (error) {
      console.error("❌ Login Error:", error);
      
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.logo}>Barangay Dalipuga</Text>
        <Button
          title="Home"
          onPress={() => router.push('/Home')} // Directs back to index.tsx
        />
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
            Welcome to Barangay 
        </Text>
         <Text style={styles.welcomeText}>
             Dalipuga Profiling System
        </Text>
        <Text style={styles.infoText}>Log in to continue access</Text>
      </View>

      {/* Login Form Section */}
      <View style={styles.loginForm}>
        <Text style={styles.formTitle}>Log In</Text>

        {/* Form */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />

        <Button title="Continue →" onPress={handleSubmit} />

        {/* Display error messages */}
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0', // Background color for the body
  } as ViewStyle,
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2c3e50', // Header background color
  } as ViewStyle,
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White text for the header
  } as TextStyle,
  welcomeSection: {
     marginBottom: 30,
    alignItems: 'center',
  } as ViewStyle,
  welcomeText: {
     marginLeft: 3,
    justifyContent: 'space-evenly',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 1,
  } as TextStyle,
  infoText: {
    marginTop: 15,
    fontSize: 16,
  } as TextStyle,
  loginForm: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  } as ViewStyle,
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  } as TextStyle,
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  } as ViewStyle,
  error: {
    color: 'red',
    marginTop: 10,
  } as TextStyle,
});