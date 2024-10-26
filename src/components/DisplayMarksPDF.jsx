import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DownloadPDF from "./DownloadPDF"; // Import your DownloadPDF component

const DisplayMarksPDF = () => {
  const location = useLocation();
  const navigate = useNavigate(); // To navigate after deletion
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Add editing state

  // Extract rollNo from location state
  const rollNo = location.state?.rollNo;
  const studentName = location.state?.studentName;
  const guardianName = location.state?.guardianName;
  const dob = location.state?.dob;
  const classSection = location.state?.classSection;
 

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/marks/getMarks/${rollNo}`);
        if (!response.ok) {
          throw new Error("Failed to fetch marks");
        }
        const data = await response.json();
        setMarks(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching marks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [rollNo]);

  const handleInputChange = (subject, field, value) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [subject]: {
        ...prevMarks[subject],
        [field]: value,
      },
    }));
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/marks/edit/${rollNo}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(marks),
      });

      if (!response.ok) {
        throw new Error("Failed to save marks");
      }
      const result = await response.json();
      console.log("Marks updated successfully:", result);
      setIsEditing(false); // Disable edit mode after saving
    } catch (error) {
      console.error("Error saving marks:", error);
    }
  };

  // Function to handle the deletion of marks
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/marks/deletemarks/${rollNo}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete marks");
      }

      console.log("Marks deleted successfully");
      navigate("/"); // Navigate back to the home page or another relevant page after deletion
    } catch (error) {
      console.error("Error deleting marks:", error);
    }
  };

  if (loading) return <p>Loading marks...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter out the last 3 subjects (assuming marks are structured correctly)
  const filteredSubjects = Object.keys(marks).slice(0, -3);

  return (
    <div>
      <h3>Marks Card for Roll No: {rollNo}</h3>
      <h1>Student Name:{studentName} </h1>
      <h1>Student Name: {guardianName}</h1>
      <h1>Student Name:{dob} </h1>
      <h1>Student Name:{classSection} </h1>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Periodic Assessment (A)</th>
            <th>Periodic Test 1 (B)</th>
            <th>Avg. A & B (C)</th>
            <th>Half Yearly Exam (D)</th>
            <th>Marks Obtained (C+D)</th>
            <th>Percentage</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => {
              const test1 = Math.round(parseFloat(marks[subject]?.test1 || 0)); // Round Periodic Assessment (A)
              const test2 = Math.round(parseFloat(marks[subject]?.test2 || 0)); // Round Periodic Test 1 (B)
              const avgAB = Math.round((test1 + test2) / 2); // Avg. A & B (C)

              return (
                <tr key={subject}>
                  <td>{subject}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={marks[subject]?.test1 || ""}
                        onChange={(e) =>
                          handleInputChange(subject, "test1", e.target.value)
                        }
                      />
                    ) : (
                      test1
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={marks[subject]?.test2 || ""}
                        onChange={(e) =>
                          handleInputChange(subject, "test2", e.target.value)
                        }
                      />
                    ) : (
                      test2
                    )}
                  </td>
                  <td>{avgAB}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={marks[subject]?.midExam || ""}
                        onChange={(e) =>
                          handleInputChange(subject, "midExam", e.target.value)
                        }
                      />
                    ) : (
                      Math.round(marks[subject].midExam)
                    )}
                  </td>
                  <td>{Math.round(marks[subject].total)}</td>
                  <td>{Math.round(marks[subject].percentage)}</td>
                  <td>{marks[subject].grade}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8">No marks available</td>
            </tr>
          )}
        </tbody>
      </table>

      {!isEditing ? (
        <button onClick={handleEdit}>Edit Marks</button> // Edit button
      ) : (
        <button onClick={handleSave}>Save Changes</button> // Save button when editing
      )}

      {/* Delete Marks Button */}
      <button onClick={handleDelete} style={{ color: "red" }}>
        Delete Marks
      </button>

      {/* Add the DownloadPDF component and pass necessary props */}
      <DownloadPDF rollNo={rollNo} marks={marks}   
                              studentName={studentName}
                              guardianName={guardianName}
                              dob={dob}
                              classSection={classSection}/>
    </div>
  );
};

export default DisplayMarksPDF;
