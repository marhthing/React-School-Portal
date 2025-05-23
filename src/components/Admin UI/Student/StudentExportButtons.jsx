import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

const StudentExportButtons = ({ students }) => {
  // Export CSV helper
  const exportCSV = () => {
    if (!students || students.length === 0) return;

    const headers = [
      "S/N",
      "Full Name",
      "Gender",
      "Class",
      "Phone",
      "Reg Number",
      "Password",
    ];

    const rows = students.map((stu, index) => [
      index + 1,
      stu.fullName,
      stu.gender,
      stu.className,
      stu.phone || "",
      stu.regNumber,
      stu.password || "",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "students_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF helper - fixed with correct import and call
  const exportPDF = () => {
    if (!students || students.length === 0) return;

    const doc = new jsPDF();

    doc.text("Student List", 14, 15);

    const columns = [
      "S/N",
      "Full Name",
      "Gender",
      "Class",
      "Phone",
      "Reg Number",
      "Password",
    ];

    const rows = students.map((stu, index) => [
      index + 1,
      stu.fullName,
      stu.gender,
      stu.className,
      stu.phone || "",
      stu.regNumber,
      stu.password || "",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 25,
    });

    doc.save("students_export.pdf");
  };

  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={exportCSV}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
      >
        Export CSV
      </button>

      <button
        onClick={exportPDF}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        Export PDF
      </button>
    </div>
  );
};

export default StudentExportButtons;
