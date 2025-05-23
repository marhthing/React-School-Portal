import React, { useState } from "react";
import Papa from "papaparse";

const StudentBulkUpload = ({ onStudentsUploaded }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, errors } = results;
        if (errors.length) {
          setError("Error parsing CSV file.");
          return;
        }

const students = data.map(row => ({
  fullName: row["Full Name"]?.trim() || "",
  gender: row["Gender"]?.trim() || "",
  className: row["Class"]?.trim() || "",
  phone: row["Phone"]?.trim() || "",
  regNumber: row["Reg Number"]?.trim() || "",
  password: row["Password"]?.trim() || "",
}));


        // Pass parsed students to parent
        onStudentsUploaded(students);
        setFile(null);
        setError("");
      },
      error: () => setError("Failed to parse CSV file."),
    });
  };

  return (
    <div className="my-4 p-4 border rounded-md bg-white dark:bg-gray-800">
      <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
        Bulk Upload Students (CSV)
      </h3>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="mb-2"
      />
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
      >
        Upload
      </button>
    </div>
  );
};

export default StudentBulkUpload;
