import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DisplayStudent = ({ students, updateStudent }) => {
  const navigate = useNavigate();

  const [editableData, setEditableData] = useState({});
  const [isEditingIndex, setIsEditingIndex] = useState(null);
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    if (!students.length) {
      navigate("/"); // Navigate to the registration page if no students
    }
  }, [students, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });
  };

  const handleSave = async (index) => {
    const studentRollNo = students[index].rollNo; // Use rollNo instead of _id

    if (!studentRollNo) {
      console.error("Student Roll No is undefined. Students array:", students); // Error handling
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/student/edit/${studentRollNo}`, {
        method: "PUT", // Make sure it's PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editableData.studentName || students[index].studentName,
          parentname: editableData.guardianName || students[index].guardianName,
          dob: editableData.dob || students[index].dob,
          div: editableData.classSection || students[index].classSection,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      const result = await response.json();
      console.log("Student updated:", result);

      // Update the student list in the parent component
      updateStudent(index, { ...students[index], ...editableData });

      setEditableData({}); // Clear editable data after saving
      setIsEditingIndex(null); // Exit edit mode
    } catch (error) {
      setError(error.message); // Set error message to display
    }
  };

  const handleEdit = (student, index) => {
    setEditableData({ ...student }); // Load the student's current data
    setIsEditingIndex(index); // Set the index of the student being edited
  };

  const handleRegisterNewStudent = () => {
    navigate("/"); // Navigate to the registration page
  };

  const handleAddMarks = (rollNo) => {
    navigate(`/add-marks/${rollNo}`); // Navigate to Add Marks component
  };

  const handleNavigateToAddMarks = () => {
    navigate("/add-marks"); // Navigate to AddMarks component
  };

  return (
    <div>
      <h3>Student Information</h3>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
      {students.map((student, index) => (
        <div key={student.rollNo || index}> {/* Use rollNo as key, fallback to index */}
          {isEditingIndex === index ? (
            <div>
              <div>
                <strong>Roll No:</strong>
                <input
                  type="text"
                  name="rollNo"
                  value={editableData.rollNo || student.rollNo} // Default to existing value
                  onChange={handleInputChange}
                  required
                />
                <br />
                <strong>Name:</strong>
                <input
                  type="text"
                  name="studentName"
                  value={editableData.studentName || student.studentName} // Default to existing value
                  onChange={handleInputChange}
                  required
                />
                <br />
                <strong>Guardian Name:</strong>
                <input
                  type="text"
                  name="guardianName"
                  value={editableData.guardianName || student.guardianName} // Default to existing value
                  onChange={handleInputChange}
                  required
                />
                <br />
                <strong>Date of Birth:</strong>
                <input
                  type="date"
                  name="dob"
                  value={editableData.dob || student.dob} // Default to existing value
                  onChange={handleInputChange}
                  required
                />
                <br />
                <strong>Class/Section:</strong>
                <input
                  type="text"
                  name="classSection"
                  value={editableData.classSection || student.classSection} // Default to existing value
                  onChange={handleInputChange}
                  required
                />
                <br />
              </div>
              <button onClick={() => handleSave(index)}>Save</button>
              <button onClick={() => setIsEditingIndex(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <strong>Roll No:</strong> {student.rollNo} <br />
              <strong>Name:</strong> {student.studentName} <br />
              <strong>Guardian Name:</strong> {student.guardianName} <br />
              <strong>Date of Birth:</strong> {student.dob} <br />
              <strong>Class/Section:</strong> {student.classSection} <br />
              <button onClick={() => handleEdit(student, index)}>Edit</button>
              <button onClick={() => handleAddMarks(student.rollNo)}>Add Marks</button>
            </div>
          )}
        </div>
      ))}
      <div>
        <button onClick={handleRegisterNewStudent}>
          Register Upcoming Students
        </button>
      </div>
      <div>
        <button onClick={handleNavigateToAddMarks}>
          Add Marks for Any Student
        </button>
      </div>
    </div>
  );
};

export default DisplayStudent;
