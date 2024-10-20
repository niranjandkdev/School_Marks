import React from "react";
import jsPDF from "jspdf";

const DownloadPDF = ({ rollNo, marks }) => {
  console.log("Marks data:", marks);
  const safeToString = (value) => {
    return value !== undefined && value !== null ? value.toString() : "-";
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Marks Card for Roll No: ${rollNo}`, 10, 10);

    // Set table headers
    doc.setFontSize(12);
    doc.text("Subject", 10, 20);
    doc.text("Periodic Assessment (A)", 40, 20);
    doc.text("Periodic Test 1 (B)", 80, 20);
    doc.text("Avg. A & B (C)", 120, 20);
    doc.text("Half Yearly Exam (D)", 150, 20);
    doc.text("Marks Obtained (C+D)", 180, 20);
    doc.text("Percentage", 220, 20);
    doc.text("Grade", 250, 20);

    // Add marks data
    let y = 30; // Starting Y position for the first row
    Object.keys(marks).forEach((subject) => {
      const subjectMarks = marks[subject];

      if (!subjectMarks) {
        console.error(`No data found for subject: ${subject}`, subjectMarks);
        return; // Skip this subject if marks are undefined
      }

      doc.text(subject, 10, y);
      doc.text(safeToString(subjectMarks.test1), 40, y);
      doc.text(safeToString(subjectMarks.test2), 80, y);
      doc.text(safeToString(subjectMarks.avgAB), 120, y);
      doc.text(safeToString(subjectMarks.midExam), 150, y);
      doc.text(safeToString(subjectMarks.total), 180, y);
      doc.text(safeToString(subjectMarks.percentage), 220, y);
      doc.text(safeToString(subjectMarks.grade), 250, y);
      y += 10; // Move to the next row
    });

  

    // Save the PDF
    doc.save(`marks_card_${rollNo}.pdf`);
  };

  return <button onClick={downloadPDF}>Download PDF</button>;
};

export default DownloadPDF;
