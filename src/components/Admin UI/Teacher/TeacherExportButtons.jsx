import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TeacherExportButtons = ({ teachers }) => {
  const exportCSV = () => {
    if (!teachers || teachers.length === 0) return;

    const headers = [
      "S/N",
      "Full Name",
      "Gender",
      "Role",
      "Phone",
      "Email",
      "Password",
    ];

    const rows = teachers.map((teacher, index) => [
      index + 1,
      teacher.fullName,
      teacher.gender,
      teacher.role,
      teacher.phone || "",
      teacher.email,
      teacher.password || "",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "teachers_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (!teachers || teachers.length === 0) return;

    const doc = new jsPDF();

    doc.text("Teacher List", 14, 15);

    const columns = [
      "S/N",
      "Full Name",
      "Gender",
      "Role",
      "Phone",
      "Email",
      "Password",
    ];

    const rows = teachers.map((teacher, index) => [
      index + 1,
      teacher.fullName,
      teacher.gender,
      teacher.role,
      teacher.phone || "",
      teacher.email,
      teacher.password || "",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 25,
    });

    doc.save("teachers_export.pdf");
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

export default TeacherExportButtons;
