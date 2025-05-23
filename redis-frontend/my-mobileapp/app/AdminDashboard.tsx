import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useRouter, Link } from "expo-router"; // Using Link from expo-router for potential internal navigation
import { BarChart, PieChart } from "react-native-chart-kit";
import { AntDesign } from '@expo/vector-icons'; // Arrow icons


const screenWidth = Dimensions.get("window").width;
      const backendURL = 'http:// 192.168.56.237:5000'; // Replace with your backend IP address

export default function AdminDashboard() {
  const [userCounts, setUserCounts] = useState({ residentsCount: 0, officersCount: 0, fourPsCount: 0 });
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6699"];

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

  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    color: (opacity = 1) => `rgba(34, 94, 168, ${opacity})`,
    labelColor: () => "#000",
    strokeWidth: 2,
    barPercentage: 0.6,
  };

  return (
    <View style={styles.dashboardContainer}>

     <View style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
  {/* 🔁 Always visible toggle arrow */}
   <TouchableOpacity style={styles.toggleButton} onPress={() => setCollapsed(!collapsed)}>
    <AntDesign
      name={collapsed ? 'right' : 'left'}
      size={30}
      color="#fff"
    />
  </TouchableOpacity>

    {/* Only show title + menu if expanded */}
  {!collapsed && (
    <>
      <Text style={styles.sidebarTitle}>Admin Panel</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/AdminDashboard')}
      >
        <Text style={styles.menuText}>Admin Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/ManageResidents')}
      >
        <Text style={styles.menuText}>Manage Residents</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/ManageOfficers')}
      >
        <Text style={styles.menuText}>Manage Officers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={handleLogout}>
        <Text style={styles.menuText}>Logout</Text>
      </TouchableOpacity>
    </>
  )}
</View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.header}> Welcome To Admin Dashboard</Text>

        
       


        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  
});
