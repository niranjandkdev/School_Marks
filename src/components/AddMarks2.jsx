import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const subjects = [
  "Language 1 (English)",
  "Language 2 (Kannada)",
  "Mathematics",
  "Science",
  "Social Science",
];

const AddMarks = ({ students, saveMarks }) => {
  const { rollNo } = useParams();
  const navigate = useNavigate();

  const [marks, setMarks] = useState(
    subjects.reduce((acc, subject) => {
      acc[subject] = {
        periodicAssessmentA: "",
        periodicTest1B: "",
        avgAB: "",
        halfYearlyExamD: "",
        marksObtained: "",
        percentage: "",
        grade: "",
      };
      return acc;
    }, {})
  );

  useEffect(() => {
    const existingMarks = marks[rollNo] || {};
    setMarks((prevMarks) => {
      if (JSON.stringify(prevMarks) !== JSON.stringify(existingMarks)) {
        return {
          ...prevMarks,
          ...existingMarks,
        };
      }
      return prevMarks;
    });
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

  const calculatePercentageAndGrade = () => {
    const updatedMarks = { ...marks };
    Object.keys(updatedMarks).forEach((subject) => {
      const { periodicAssessmentA, periodicTest1B, halfYearlyExamD } = updatedMarks[subject];
      const totalMarks = parseFloat(periodicAssessmentA || 0) + parseFloat(periodicTest1B || 0) + parseFloat(halfYearlyExamD || 0);
      const percentage = (totalMarks / 80) * 100;
      const grade = percentage >= 60 ? "A" : percentage >= 40 ? "B" : "C";

      updatedMarks[subject].percentage = percentage.toFixed(2);
      updatedMarks[subject].grade = grade;
    });
    setMarks(updatedMarks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiData = {
      language1: marks["Language 1 (English)"],
      language2: marks["Language 2 (Kannada)"],
      mathematics: marks["Mathematics"],
      science: marks["Science"],
      socialScience: marks["Social Science"],
    };

    try {
      const response = await fetch(`http://localhost:5000/marks/postMarks/${rollNo}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData), 
        
        
      });
      console.log(apiData);

      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to save marks: ${errorText}`);
      }

      const result = await response.json();
      console.log("Marks saved successfully:", result);
      navigate("/display-marks-pdf", { state: { marks, rollNo } });
    } catch (error) {
      console.error("Error saving marks:", error);
    }
  };

  return (
    <div>
      <h3>Add Marks for Roll No: {rollNo}</h3>
      <form onSubmit={handleSubmit}>
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
            {subjects.map((subject) => (
              <tr key={subject}>
                <td>{subject}</td>
                <td>
                  <input
                    type="number"
                    value={marks[subject].periodicAssessmentA}
                    onChange={(e) => handleInputChange(subject, "periodicAssessmentA", e.target.value)}
                    onBlur={calculatePercentageAndGrade}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={marks[subject].periodicTest1B}
                    onChange={(e) => handleInputChange(subject, "periodicTest1B", e.target.value)}
                    onBlur={calculatePercentageAndGrade}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={marks[subject].avgAB}
                    disabled
                    placeholder="Auto-calculate"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={marks[subject].halfYearlyExamD}
                    onChange={(e) => handleInputChange(subject, "halfYearlyExamD", e.target.value)}
                    onBlur={calculatePercentageAndGrade}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={marks[subject].marksObtained}
                    disabled
                    placeholder="Auto-calculate"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={marks[subject].percentage}
                    disabled
                    placeholder="Auto-calculate"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={marks[subject].grade}
                    disabled
                    placeholder="Auto-calculate"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Save Marks</button>
      </form>
    </div>
  );
};

export default AddMarks;
