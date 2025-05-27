import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PrintButton = ({ printRef }) => {
  const handleExportPDF = async () => {
    if (!printRef.current) return;

    // Take screenshot of the div
    const element = printRef.current;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // improve quality
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 size in pixels at 96dpi approx
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image height to keep aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add image to PDF, center vertically if smaller than page height
      let y = 0;
      if (imgHeight < pdfHeight) {
        y = (pdfHeight - imgHeight) / 2;
      }

      pdf.addImage(imgData, "PNG", 0, y, pdfWidth, imgHeight);
      pdf.save("Student_Slip.pdf");
    } catch (error) {
      console.error("Could not generate PDF", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  return (
    <button
      onClick={handleExportPDF}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      Export as PDF
    </button>
  );
};

export default PrintButton;
