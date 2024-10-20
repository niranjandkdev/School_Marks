import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentRegistration from "./components/StudentRegistration";
import DisplayStudent from "./components/DisplayStudent";
import AddMarks from "./components/AddMarks";
import DisplayMarks from "./components/DisplayMarks";
import DisplayMarksPDF from "./components/DisplayMarksPDF"; // Import DisplayMarksPDF

const App = () => {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // State to hold marks

  const addStudent = (student) => {
    setStudents((prevStudents) => [...prevStudents, student]);
  };

  const updateStudent = (index, updatedStudent) => {
    const updatedStudents = [...students];
    updatedStudents[index] = updatedStudent;
    setStudents(updatedStudents);
  };

  const saveMarks = (rollNo, marksData) => {
    setMarks((prevMarks) => ({ ...prevMarks, [rollNo]: marksData }));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentRegistration addStudent={addStudent} />} />
        <Route path="/display-student" element={<DisplayStudent students={students} updateStudent={updateStudent} />} />
        <Route path="/add-marks/:rollNo" element={<AddMarks students={students} saveMarks={saveMarks} />} />
       
        <Route path="/display-marks-pdf" element={<DisplayMarksPDF marks={marks} />} />
      </Routes>
    </Router>
  );
};

export default App;
