import React, { useState } from "react";
import "../styling/StudentRegistration.css"; // Import the updated CSS file
import DownloadPDF from "./DownloadPDF";

const StudentRegistration = ({ addStudent }) => {
  const initialData = {
    rollNo: "",
    studentName: "",
    guardianName: "",
    dob: "",
    classSection: "1", // Default to Class 1
  };

  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.rollNo || !formData.studentName || !formData.guardianName || !formData.dob) {
      setError("Please fill out all fields.");
      return false;
    }
    setError(null);
    return true;
  };

  // Handle form submission
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  console.log("Submitting form data:", formData); // Debugging log
  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:5000/student/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rollno: formData.rollNo,
        name: formData.studentName,
        parentname: formData.guardianName,
        dob: formData.dob,
        div: formData.classSection,
      }),
    });

    console.log("API response status:", response.status); // Debugging log

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      let result;

      // Check if the response is JSON
      if (contentType && contentType.includes("application/json")) {
        result = await response.json(); // Parse JSON response
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        result = { message: text }; // Wrap in an object
      }

      console.log("Student registered:", result); // Debugging log

      // Check for success message
      if (result.message && result.message.includes("successfully")) {
        // Add the newly registered student to the list
        addStudent({
          studentName: formData.studentName,
          rollNo: formData.rollNo,
          guardianName: formData.guardianName,
          dob: formData.dob,
          classSection: formData.classSection,
        });

        setFormData(initialData); // Clear form
        // Optionally, you could use a different method to refresh the student list
        window.location.reload(); // Reload the page
      } else {
        throw new Error("Unexpected response format");
      }
    } else {
      // Handle error responses
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Error during registration:", error.message); // Debugging log
    setError("Failed to register student. " + error.message);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="registration-container">
      <h2>Register Student</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Roll No:</label>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Student Name:</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mother/Father/Guardian Name:</label>
          <input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Class/Section:</label>
          <select
            name="classSection"
            value={formData.classSection}
            onChange={handleChange}
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register Student"}
        </button>
      </form>

    
    </div>
  );
};

export default StudentRegistration;
