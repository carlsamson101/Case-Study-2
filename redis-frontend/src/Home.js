import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import a CSS file for styling



function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Header Section */}
      <header className="headerhome">
        <div className="logo">
          <h1>Barangay Dalipuga</h1>
        </div>
        <nav className="navbar">
          <ul>
          <li>
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault(); // Prevent default anchor behavior
          navigate('/'); // Redirect to home page
        }}
      >
        Home
      </a>
    </li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><button onClick={() => navigate('/auth')}>Login</button></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Welcome to Barangay Dalipuga</h2>
        <p>"Dalipuga: A Place of Serenity and Strength, Where Hills and Waters Tell Our Story."</p>
      </section>

      {/* Centered Info Sections */}
      <div className="home-info-sections">
        {/* About Section */}
        <section className="home-about" id="about" >
  <div className="home-about-text">
    <h3>About Us</h3>
    <p>
      Dalipuga is a barangay in the city of Iligan. Its population as determined by the 2020 Census was 21,470.
      This represented 5.91% of the total population of Iligan. The household population of Dalipuga in the 2015
      Census was 19,680, broken down into 4,505 households or an average of 4.37 members per household.
      The median age of 24 indicates that half of the entire population of Dalipuga are aged less than 24, while the other half are over 24.
    </p>
    <br />
    <p>
      The Barangay Profiling System is designed to help barangay officials manage resident records
      and improve community services. Our goal is to make barangay operations more efficient and
      transparent.
    </p>
  </div>
  <div className="home-about-image">
  <img src="/backs.jpg" alt="Dalipuga Barangay" />

  </div>
</section>

 {/* Two Column Section */}
 <section className="home-two-column-section">
        <div className="home-column">
          <img src="/park.jpg" alt="Barangay Dalipuga" />
          <p> <b>Centennial Park </b> in Dalipuga is a scenic recreational spot in Iligan City, known for its lush greenery,
             peaceful ambiance, and picturesque views. It’s a popular destination for relaxation, picnics, and outdoor
              activities, offering a refreshing escape into nature.</p>
        </div>
        <div className="home-column">
          <img src="/project.jpg" alt="Community Programs" />
          <p>Programs aimed at uplifting the lives of our residents.</p>
        </div>
      </section>


        {/* Contact Section */}
        <section id="contact" className="home-contact">
          <h3>Contact Us</h3>
          <p>
            <strong>Email:</strong> brgydalipugablgu@yahoo.comm <br />
            <strong>Phone:</strong> +63 123 456 7890
          </p>
        </section>

        {/* Location Section */}
        <section id="location" className="home-location">
          <h3> Location</h3>
          <p>Dalipuga, Iligan City, Philippines</p>
          <br></br>
          <img src="/map.png" alt="Community Programs" />
        </section>
      </div>

     
      {/* Footer Section */}
      <footer className="home-footer">
        <p>&copy; 2025 Barangay Profiling System by Carl Joseph Samson.</p>
      </footer>
    </div>
  );
}

export default Home;