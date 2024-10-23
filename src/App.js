import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentRegistration from "./components/StudentRegistration";
import DisplayStudent from "./components/DisplayStudent";
import AddMarks from "./components/AddMarks";
import DisplayMarksPDF from "./components/DisplayMarksPDF";
import Header from "./components/Header";

const App = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all students from the backend when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/student/allstudents");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();

        // Assuming the API returns students as { name, rollno, parentname, dob, div }
        const formattedData = data.map(student => ({
          studentName: student.name,
          rollNo: student.rollno,
          guardianName: student.parentname,
          dob: student.dob,
          classSection: student.div
        }));

        setStudents(formattedData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchStudents();
  }, []);

  // Add new student to the list
  const addStudent = (student) => {
    setStudents((prevStudents) => [...prevStudents, student]);
  };

  // Update student information
  const updateStudent = (index, updatedStudent) => {
    const updatedStudents = [...students];
    updatedStudents[index] = updatedStudent;
    setStudents(updatedStudents);
  };

  return (
    <Router>
      <Header/>
      <div>
       
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Routes>
          {/* Route for Student Registration */}
          <Route
            path="/"
            element={
              <>
                <StudentRegistration addStudent={addStudent} />
                {students.length > 0 && (
                  <DisplayStudent students={students} updateStudent={updateStudent} />
                )}
              </>
            }
          />

          {/* Route for Adding Marks */}
          <Route
            path="/add-marks/:rollNo"
            element={<AddMarks students={students} />}
          />

          {/* Route for Displaying Marks in PDF */}
          <Route
            path="/display-marks-pdf"
            element={<DisplayMarksPDF />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
