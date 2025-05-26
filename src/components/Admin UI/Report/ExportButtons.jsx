import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportButtons({ reportType, filters, data }) {
  // Convert data array to CSV string
  const convertToCSV = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return '';

    const headers = Object.keys(dataArray[0]);
    const csvRows = [
      headers.join(','), // header row
      ...dataArray.map(row =>
        headers.map(field => {
          let cell = row[field];
          if (typeof cell === 'string') {
            // Escape quotes in CSV
            cell = cell.replace(/"/g, '""');
          }
          return `"${cell ?? ''}"`;
        }).join(',')
      ),
    ];
    return csvRows.join('\n');
  };

  // Handle CSV export
  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export.');
      return;
    }
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const filename = `${reportType}_report_${filters.class || 'all'}_${filters.term || 'all'}_${filters.session || 'all'}.csv`;

    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle PDF export using jsPDF + autotable
  const handleExportPDF = () => {
    if (!data || data.length === 0) {
      alert('No data to export.');
      return;
    }

    const doc = new jsPDF();

    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    const filtersSummary = `Class: ${filters.class || 'All'}, Term: ${filters.term || 'All'}, Session: ${filters.session || 'All'}${filters.subject ? `, Subject: ${filters.subject}` : ''}`;

    doc.setFontSize(18);
    doc.text(title, 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(filtersSummary, 14, 30);

    const columns = Object.keys(data[0]).map(key => ({ header: key, dataKey: key }));
    doc.autoTable({
      startY: 40,
      columns,
      body: data,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 14, right: 14 },
    });

    const filename = `${reportType}_report_${filters.class || 'all'}_${filters.term || 'all'}_${filters.session || 'all'}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="mt-4 flex gap-4">
      <button
        onClick={handleExportCSV}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        type="button"
      >
        Export CSV
      </button>

      <button
        onClick={handleExportPDF}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        type="button"
      >
        Export PDF
      </button>
    </div>
  );
}
