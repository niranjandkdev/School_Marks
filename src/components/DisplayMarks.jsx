import React from "react";
import { useParams } from "react-router-dom"; // To get student roll number

const subjects = [
  "Language 1 (English)",
  "Language 2 (Kannada)",
  "Mathematics",
  "Science",
  "Social Science",
];

const DisplayMarks = ({ students }) => {
  const { rollNo } = useParams(); // Get roll number from URL parameters
  const student = students.find((s) => s.rollNo === rollNo); // Find the specific student by roll number

  if (!student || !student.marks) {
    return <p>No marks available for Roll No: {rollNo}</p>;
  }

  const marks = student.marks; // Get the saved marks

  return (
    <div>
      <h3>Marks for Roll No: {rollNo}</h3>
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
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject}>
              <td>{subject}</td>
              <td>{marks[subject].periodicAssessmentA}</td>
              <td>{marks[subject].periodicTest1B}</td>
              <td>{marks[subject].avgAB}</td>
              <td>{marks[subject].halfYearlyExamD}</td>
              <td>{marks[subject].marksObtained}</td>
              <td>{marks[subject].percentage}</td>
              <td>{marks[subject].grade}</td>
              <td>
                <button>Edit</button> {/* You can add the edit functionality here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayMarks;
