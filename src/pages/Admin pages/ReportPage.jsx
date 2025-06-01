import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/ui/AdminLayout';

import ClassReport from '../../components/Admin UI/Report/ClassReport';
import SubjectReport from '../../components/Admin UI/Report/SubjectReport';
import ExportButtons from '../../components/Admin UI/Report/ExportButtons';

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState('class'); // 'class' or 'subject'

  // Filters used for both reports
  const [filters, setFilters] = useState({
    class: '',
    term: '',
    session: '',
    subject: '', // only relevant for subject report
  });

  // Options for filters, fetched or static
  const classOptions = ['SS1', 'SS2', 'SS3'];
  const termOptions = ['First Term', 'Second Term', 'Third Term'];
  const sessionOptions = ['2023/2024', '2024/2025', '2025/2026'];

  const subjectOptions = ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry'];

  // Data states
  const [classReportData, setClassReportData] = useState(null);
  const [subjectReportData, setSubjectReportData] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab !== 'class') return;
    if (!filters.class || !filters.term || !filters.session) return;

    setLoading(true);
    setError(null);

    fetch(
      `/api/reports/class?class=${encodeURIComponent(filters.class)}&term=${encodeURIComponent(filters.term)}&session=${encodeURIComponent(filters.session)}`
    )
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch class report data');
        return res.json();
      })
      .then(data => {
        setClassReportData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filters.class, filters.term, filters.session, activeTab]);

  useEffect(() => {
    if (activeTab !== 'subject') return;
    if (!filters.class || !filters.subject || !filters.term || !filters.session) return;

    setLoading(true);
    setError(null);

    fetch(
      `/api/reports/subject?class=${encodeURIComponent(filters.class)}&subject=${encodeURIComponent(filters.subject)}&term=${encodeURIComponent(filters.term)}&session=${encodeURIComponent(filters.session)}`
    )
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch subject report data');
        return res.json();
      })
      .then(data => {
        setSubjectReportData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filters.class, filters.subject, filters.term, filters.session, activeTab]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 mt-20 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Reports
        </h1>

        <div className="mb-6 border-b border-gray-300 dark:border-gray-600">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`pb-2 border-b-2 font-medium transition-colors duration-200 ${
                activeTab === 'class'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('class')}
            >
              Class Report
            </button>
            <button
              className={`pb-2 border-b-2 font-medium transition-colors duration-200 ${
                activeTab === 'subject'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('subject')}
            >
              Subject Report
            </button>
          </nav>
        </div>

        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400">Error: {error}</div>
        )}

        {loading && (
          <div className="mb-4 text-gray-700 dark:text-gray-300">Loading...</div>
        )}

        {activeTab === 'class' && !loading && (
          <>
            <ClassReport
              filters={filters}
              onFilterChange={handleFilterChange}
              data={classReportData}
              classOptions={classOptions}
              termOptions={termOptions}
              sessionOptions={sessionOptions}
            />
            <ExportButtons reportType="class" filters={filters} data={classReportData} />
          </>
        )}

        {activeTab === 'subject' && !loading && (
          <>
            <SubjectReport
              filters={filters}
              onFilterChange={handleFilterChange}
              data={subjectReportData}
              classOptions={classOptions}
              subjectOptions={subjectOptions}
              termOptions={termOptions}
              sessionOptions={sessionOptions}
            />
            <ExportButtons reportType="subject" filters={filters} data={subjectReportData} />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
