import React from "react";
import "../styling/Header.css"; // Import the CSS file for styling

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo">
        <img
          src="https://citpublicschool.org/wp-content/uploads/2019/03/School-Logo-300x97.jpg"
          alt="CIT Public School Logo"
        />
      </div>
      <div className="header-text">
        <h1>CIT Public School</h1>
        <h3>Affiliated to CBSE New Delhi</h3>
      </div>
      <div className="middle-text">
        <h2>Marks Management System</h2>
      </div>
      <div className="marks-logo">
        <img
          src="https://img.freepik.com/free-vector/scrum-method-concept-illustration_114360-13019.jpg?ga=GA1.1.938841253.1728959236&semt=ais_hybrid" // Replace with your logo path
          alt="Marks Management System Logo"
        />
      </div>
    </header>
  );
};

export default Header;
