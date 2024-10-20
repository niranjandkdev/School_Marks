import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentRegistration = ({ addStudent }) => {
  const initialData = {
    rollNo: "",
    studentName: "",
    guardianName: "",
    dob: "",
    classSection: "",
  };

  const [formData, setFormData] = useState(initialData);
  const navigate = useNavigate();
  const [error, setError] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (!response.ok) {
        throw new Error("Failed to register student");
      }

      const result = await response.json();
      console.log("Student registered:", result);

      addStudent(formData); 
      navigate("/display-student");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Register Student</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Roll No:</label>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Student Name:</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mother/Father/Guardian Name:</label>
          <input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Class/Section:</label>
          <input
            type="text"
            name="classSection"
            value={formData.classSection}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register Student</button>
      </form>
    </div>
  );
};

export default StudentRegistration;
