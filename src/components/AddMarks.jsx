

import { useState, useEffect } from "react";
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
        test1: "",
        test2: "",
        midExam: "",
        total: "",
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
      const { test1, test2, midExam } = updatedMarks[subject];
      const totalMarks = parseFloat(test1 || 0) + parseFloat(test2 || 0) + parseFloat(midExam || 0);
      const percentage = (totalMarks / 80) * 100;
      const grade = percentage >= 60 ? "A" : percentage >= 40 ? "B" : "C";

      updatedMarks[subject].total = totalMarks;
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
              <th>Test 1</th>
              <th>Test 2</th>
              <th>Mid Exam</th>
              <th>Total Marks</th>
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
                    value={marks[subject].test1}
                    onChange={(e) => handleInputChange(subject, "test1", e.target.value)}
                    onBlur={calculatePercentageAndGrade}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={marks[subject].test2}
                    onChange={(e) => handleInputChange(subject, "test2", e.target.value)}
                    onBlur={calculatePercentageAndGrade}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={marks[subject].midExam}
                    onChange={(e) => handleInputChange(subject, "midExam", e.target.value)}
                    onBlur={calculatePercentageAndGrade}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={marks[subject].total}
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
