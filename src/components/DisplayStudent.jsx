import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/DisplayStudent.css"; // Assuming you're using an external CSS file for styling

const DisplayStudent = ({ updateStudent }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [marksAvailability, setMarksAvailability] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [error, setError] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [isEditingIndex, setIsEditingIndex] = useState(null);

  // Fetch students from the database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/student/allstudents");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        const formattedData = data.map((student) => ({
          studentName: student.name,
          rollNo: student.rollno,
          guardianName: student.parentname,
          dob: student.dob,
          classSection: student.div,
        }));
        setStudents(formattedData);
        checkMarksAvailability(formattedData); // Check if marks exist for each student
      } catch (error) {
        setError(error.message);
      }
    };

    fetchStudents();
  }, []);

  // Format the date to "DD/MM/YYYY"
  const formatDate = (dob) => {
    const date = new Date(dob);
    return date.toLocaleDateString("en-GB");
  };

  // Function to check if marks are already added for each student
  const checkMarksAvailability = async (studentsList) => {
    const availability = {};
    for (const student of studentsList) {
      try {
        const response = await fetch(`http://localhost:5000/marks/getMarks/${student.rollNo}`);
        availability[student.rollNo] = response.ok; // true if marks exist, false if not
      } catch (err) {
        availability[student.rollNo] = false; // Handle the case if the request fails
      }
    }
    setMarksAvailability(availability);
  };

  const handleDelete = async (rollNo, index) => {
    try {
      const response = await fetch(`http://localhost:5000/student/deletestudent/${rollNo}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle inline edit action
  const handleEdit = (student, index) => {
    setEditableData({ ...student }); // Load the student's current data
    setIsEditingIndex(index); // Set the index of the student being edited
  };

  // Function to handle saving the edited student data
  const handleSave = async (index) => {
    const studentRollNo = students[index].rollNo;

    try {
      const response = await fetch(`http://localhost:5000/student/edit/${studentRollNo}`, {
        method: "PUT",
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

      // Update the student list in the component
      const updatedStudents = [...students];
      updatedStudents[index] = { ...students[index], ...editableData };
      setStudents(updatedStudents);

      setEditableData({}); // Clear editable data after saving
      setIsEditingIndex(null); // Exit edit mode
    } catch (error) {
      setError(error.message); // Set error message to display
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toString().includes(searchTerm)
  );

  return (
    <div className="student-container">
      <h3>Student Information</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or roll no."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      {filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Guardian Name</th>
              <th>Date of Birth</th>
              <th>Class/Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.rollNo || index}>
                {isEditingIndex === index ? (
                  <>
                    <td>{student.rollNo}</td>
                    <td>
                      <input
                        type="text"
                        name="studentName"
                        value={editableData.studentName || student.studentName}
                        onChange={(e) => setEditableData({ ...editableData, studentName: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="guardianName"
                        value={editableData.guardianName || student.guardianName}
                        onChange={(e) => setEditableData({ ...editableData, guardianName: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="dob"
                        value={editableData.dob || student.dob}
                        onChange={(e) => setEditableData({ ...editableData, dob: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="classSection"
                        value={editableData.classSection || student.classSection}
                        onChange={(e) => setEditableData({ ...editableData, classSection: e.target.value })}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSave(index)}>Save</button>
                      <button onClick={() => setIsEditingIndex(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{student.rollNo}</td>
                    <td>{student.studentName}</td>
                    <td>{student.guardianName}</td>
                    <td>{formatDate(student.dob)}</td>
                    <td>{student.classSection}</td>
                    <td>
                      <button onClick={() => handleEdit(student, index)}>Edit</button>
                      <button onClick={() => handleDelete(student.rollNo, index)}>Delete</button>
                      {marksAvailability[student.rollNo] ? (
                        <button
                          className="action-button"
                          onClick={() =>
                            navigate("/display-marks-pdf", { state: { rollNo: student.rollNo } })
                          }
                        >
                          View Marks
                        </button>
                      ) : (
                        <button
                          className="action-button"
                          onClick={() => navigate(`/add-marks/${student.rollNo}`)}
                        >
                          Add Marks
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DisplayStudent;
