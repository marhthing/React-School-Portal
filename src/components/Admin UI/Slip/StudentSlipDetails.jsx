import React, { forwardRef } from "react";

// Using forwardRef so parent can attach ref for printing
const StudentSlipDetails = forwardRef(({ student }, ref) => {
  if (!student) return null;

  const { regNumber, name, gender, class: studentClass, phone, email } = student;

  return (
    <div
      ref={ref}
      className="border border-gray-300 rounded p-6 bg-white shadow-md max-w-xl mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Student Information Slip
      </h2>

      <div className="space-y-3 text-gray-700">
        <p>
          <span className="font-semibold">Registration Number:</span>{" "}
          {regNumber}
        </p>
        <p>
          <span className="font-semibold">Name:</span> {name}
        </p>
        <p>
          <span className="font-semibold">Class:</span> {studentClass}
        </p>
        <p>
          <span className="font-semibold">Gender:</span> {gender}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {phone}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {email}
        </p>
      </div>
    </div>
  );
});

export default StudentSlipDetails;
