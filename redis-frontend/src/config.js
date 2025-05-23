// config.js

const LOCAL_IP = "192.168.1.10"; // Your local IP address (usually static for home networks)

let BASE_URL;

// Check if it's a web environment using window
if (typeof window !== "undefined" && window.location) {
  // Web environment (browser)
  BASE_URL = `http://localhost:5000`; // Web will use localhost
} else {
  // Mobile environment (React Native)
  BASE_URL = `http://${LOCAL_IP}:5000`; // Mobile will use your local IP
}

export { BASE_URL };
