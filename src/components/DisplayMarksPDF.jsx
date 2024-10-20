import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DownloadPDF from "./DownloadPDF"; // Import your DownloadPDF component

const DisplayMarksPDF = () => {
  const location = useLocation();
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Add editing state

  // Extract rollNo from location state
  const rollNo = location.state?.rollNo;

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

  if (loading) return <p>Loading marks...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter out the last 3 subjects (assuming marks are structured correctly)
  const filteredSubjects = Object.keys(marks).slice(0, -3);

  return (
    <div>
      <h3>Marks Card for Roll No: {rollNo}</h3>
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
            filteredSubjects.map((subject) => (
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
                    marks[subject].test1
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
                    marks[subject].test2
                  )}
                </td>
                <td>{marks[subject].avgAB}</td>
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
                    marks[subject].midExam
                  )}
                </td>
                <td>{marks[subject].total}</td>
                <td>{marks[subject].percentage}</td>
                <td>{marks[subject].grade}</td>
              </tr>
            ))
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

      {/* Add the DownloadPDF component and pass necessary props */}
      <DownloadPDF rollNo={rollNo} marks={marks} />
    </div>
  );
};

export default DisplayMarksPDF;
