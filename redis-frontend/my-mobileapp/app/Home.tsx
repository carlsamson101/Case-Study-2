import { View, Text, StyleSheet, Image, ScrollView, Button, ViewStyle,  ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';


  export const options = {
  title: 'Home', // Change the screen title
};
export default function HomeScreen() {
  const router = useRouter();

  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}

      <View style={styles.logoContainer}>
  <Text style={styles.logo}>Barangay Dalipuga</Text>
</View>
      <View style={styles.header}>
    
        <View style={styles.nav}>
          <Text style={styles.navItem} onPress={() => router.push('/Home')}>Home </Text>
          <Text style={styles.navItem} onPress={() => router.push('/Home')}>About</Text>
          <Text style={styles.navItem} onPress={() => router.push('/Home')}>Contact</Text>
          
          <View style={styles.nav1}>
          <Button title="Login" onPress={() => router.push('/Login')} />

        </View>
        </View>
         
      </View>

      {/* Hero Section with overlay text */}
      <View style={styles.heroContainer}>
        <ImageBackground source={require('../assets1/falls.jpg')} style={styles.heroImage}>
          <View style={styles.overlay} />
          <Text style={styles.heroTitle}>Welcome to Barangay Dalipuga</Text>
          <Text style={styles.heroSubtitle}>
            "Dalipuga: A Place of Serenity and Strength, Where Hills and Waters Tell Our Story."
          </Text>
        </ImageBackground>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.text}>
      Dalipuga is a barangay in the city of Iligan. Its population as determined by the 2020 Census was 21,470.
      This represented 5.91% of the total population of Iligan. The household population of Dalipuga in the 2015
        </Text>
        <Image source={require('../assets1/backs.jpg')} style={styles.image} />
      </View>

      {/* Two Column Section */}
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Image source={require('../assets1/park.jpg')} style={styles.image} />
          <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Centennial Park</Text> is a scenic recreational spot in Iligan City, known for its lush greenery,
             peaceful ambiance, and picturesque views.</Text>
        </View>
        <View style={styles.column}>
          <Image source={require('../assets1/project.jpg')} style={styles.image} />
          <Text style={styles.text}>Programs aimed at uplifting the lives of our residents.</Text>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text>Email: brgydalipuga@yahoo.com</Text>
        <Text>Phone: +63 123 456 7890</Text>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text>Dalipuga, Iligan City, Philippines</Text>
        <Image source={require('../assets1/map.png')} style={styles.image} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>© 2025 Barangay Profiling System by Carl Joseph Samson.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
  },

  logoContainer: {
    alignItems: 'center',   // Center the logo horizontally
    marginBottom: 20,       // Add some spacing below the logo
  },

  logo: {
    fontSize: 24,           // Size of the font
    fontWeight: 'bold',     // Make the text bold
    color: '#000',          // Set the text color to white
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  nav1: {
flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: -5, 
    marginBottom: 5,
  },
  navItem: {
    fontSize: 16,
    color: '#ffffff',
    justifyContent: 'space-around',
    fontWeight: '500',
    
  },
  heroContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    zIndex: 1,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d3557',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 180,
    marginTop: 10,
    borderRadius: 10,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  column: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  footer: {
    marginTop: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
});