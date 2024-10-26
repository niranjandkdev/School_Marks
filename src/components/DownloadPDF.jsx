import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "./School-Logo-300x97.jpg"; // Adjust path as needed

const DownloadPDF = ({ rollNo, marks, studentName = "N/A", classSection = "N/A", guardianName = "N/A", dob = "N/A" }) => {
  console.log("Student Details:", { rollNo, studentName, classSection, guardianName, dob });
  console.log("Marks Data:", marks);

  const safeToString = (value) => (value !== undefined && value !== null ? value.toString() : "-");

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add the logo image to the PDF
    doc.addImage(logo, "PNG", 15, 20, 30, 20); // (image, format, x, y, width, height)

    // Enhanced School Header with underline
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CIT Public School", 105, 25, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Affiliated to CBSE, New Delhi, Affiliation No. 831295", 105, 32, { align: "center" });
    doc.text("N H 206, Herur, Gubbi, Tumkur 572216", 105, 37, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Progress Report for Term I (2024-25)", 105, 45, { align: "center" });
    // doc.setDrawColor(0, 0, 0); // Black underline
    // doc.line(50, 40, 160, 40); // Horizontal line under header

    // doc.setFontSize(12);
  
    // doc.line(50, 53, 160, 53); // Horizontal line under term title

    // Student Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Roll No:", 14, 65);
    doc.setFont("helvetica", "normal");
    doc.text(safeToString(rollNo), 31, 65);

    doc.setFont("helvetica", "bold");
    doc.text("Student Name:", 14, 72);
    doc.setFont("helvetica", "normal");
    doc.text(safeToString(studentName), 45, 72);

    doc.setFont("helvetica", "bold");
    doc.text("Class/Section:", 14, 79);
    doc.setFont("helvetica", "normal");
    doc.text(safeToString(classSection), 43, 79);

    doc.setFont("helvetica", "bold");
    doc.text("Guardian Name:", 14, 86);
    doc.setFont("helvetica", "normal");
    doc.text(safeToString(guardianName), 47, 86);

    doc.setFont("helvetica", "bold");
    doc.text("Date of Birth:", 14, 93);
    doc.setFont("helvetica", "normal");
    doc.text(safeToString(dob), 41, 93);

    // Draw a border around the student information section
    doc.setDrawColor(0, 0, 0);

    doc.rect(13, 58, 183, 40);

    // Prepare table with bold header and larger font for headers
    const tableColumnHeaders = [
      { header: "Subject", dataKey: "subject" },
      { header: "Periodic Assessment (A)", dataKey: "test1" },
      { header: "Periodic Test 1 (B)", dataKey: "test2" },
      { header: "Avg. A & B (C)", dataKey: "avgAB" },
      { header: "Half Yearly Exam (D)", dataKey: "midExam" },
      { header: "Marks Obtained (C+D)", dataKey: "total" },
      { header: "Percentage", dataKey: "percentage" },
      { header: "Grade", dataKey: "grade" }
    ];

    // Prepare table data, delete last 3 rows
    const tableRows = Object.keys(marks || {}).map((subject) => {
      const subjectMarks = marks[subject] || {};
      return {
        subject: subject,
        test1: safeToString(subjectMarks.test1),
        test2: safeToString(subjectMarks.test2),
        avgAB: safeToString(subjectMarks.avg),
        midExam: safeToString(subjectMarks.midExam),
        total: safeToString(subjectMarks.total),
        percentage: safeToString(subjectMarks.percentage),
        grade: safeToString(subjectMarks.grade)
      };
    }).slice(0, -3); // Remove last 3 rows

    // Display table with stylized header
    doc.autoTable({
      startY: 108,
      head: [tableColumnHeaders.map(header => header.header)],
      body: tableRows.map(row => Object.values(row)),
      theme: "grid",
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0,0,0],
        fontStyle: "bold",
        fontSize: 12
      },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle"
      },
      columnStyles: {
        subject: { cellWidth: 30 },
        test1: { cellWidth: 30 },
        test2: { cellWidth: 30 },
        avgAB: { cellWidth: 30 },
        midExam: { cellWidth: 30 },
        total: { cellWidth: 30 },
        percentage: { cellWidth: 30 },
        grade: { cellWidth: 20 }
      }
    });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("This is a system-generated report and does not require a signature.", 105, doc.internal.pageSize.height - 10, { align: "center" });

    doc.save(`marks_card_${rollNo}.pdf`);
  };

  return <button onClick={downloadPDF}>Download PDF</button>;
};

export default DownloadPDF;
