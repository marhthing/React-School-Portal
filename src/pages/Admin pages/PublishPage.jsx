import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

import ResultCalculationForm from '../../components/Admin UI/Publish/ResultCalculationForm';
import ResultVisibilityControl from '../../components/Admin UI/Publish/ResultVisibilityControl';
import TermDateSetter from '../../components/Admin UI/Publish/TermDateSetter';

const ResultPublishPage = () => {
  // Result Calculation States
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcMessage, setCalcMessage] = useState(null);

  // Result Visibility States
  const [visibilitySettings, setVisibilitySettings] = useState({ classes: [], students: [] });
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState(null);
  const [students, setStudents] = useState([]);

  // Term Dates States
  const [termDates, setTermDates] = useState({ endOfTerm: '', nextTermStart: '' });
  const [termDatesLoading, setTermDatesLoading] = useState(false);
  const [termDatesMessage, setTermDatesMessage] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [clsRes, termRes, sesRes, studentsRes] = await Promise.all([
          axios.get('http://localhost/sfgs_api/api/classes.php'),
          axios.get('http://localhost/sfgs_api/api/terms.php'),
          axios.get('http://localhost/sfgs_api/api/sessions.php'),
          axios.get('http://localhost/sfgs_api/api/students.php'), // Fetch students
        ]);
        setClasses(clsRes.data);
        setTerms(termRes.data);
        setSessions(sesRes.data);
        setStudents(studentsRes.data);

        if (clsRes.data.length) setSelectedClass(clsRes.data[0].id);
        if (termRes.data.length) setSelectedTerm(termRes.data[0].name);
        if (sesRes.data.length) setSelectedSession(sesRes.data[0].id);
      } catch (error) {
        console.error('Dropdown fetch failed:', error);
      }
    };

    const fetchVisibility = async () => {
      setVisibilityLoading(true);
      try {
        const res = await axios.get('http://localhost/sfgs_api/api/result_visibility.php');
        setVisibilitySettings(res.data || { classes: [], students: [] });
      } catch (error) {
        console.error('Visibility fetch failed:', error);
      } finally {
        setVisibilityLoading(false);
      }
    };

    const fetchTermDates = async () => {
      setTermDatesLoading(true);
      try {
        const res = await axios.get('http://localhost/sfgs_api/api/term_dates.php');
        setTermDates(res.data || { endOfTerm: '', nextTermStart: '' });
      } catch (error) {
        console.error('Term dates fetch failed:', error);
      } finally {
        setTermDatesLoading(false);
      }
    };

    fetchDropdownData();
    fetchVisibility();
    fetchTermDates();
  }, []);

  const handleCalculateResults = async () => {
    setCalcLoading(true);
    setCalcMessage(null);
    try {
      const res = await axios.post('http://localhost/sfgs_api/api/publish_result.php', {
        class_id: selectedClass,
        term: selectedTerm,
        session_id: selectedSession,
      });
      setCalcMessage({ type: 'success', text: res.data.message || 'Results calculated successfully.' });
    } catch (error) {
      setCalcMessage({ type: 'error', text: error.response?.data?.message || 'Calculation failed.' });
    } finally {
      setCalcLoading(false);
    }
  };

  // Visibility toggle handlers
  const onToggleClassVisibility = (classId) => {
    setVisibilitySettings((prev) => {
      const classes = prev.classes.includes(classId)
        ? prev.classes.filter((id) => id !== classId)
        : [...prev.classes, classId];
      return { ...prev, classes };
    });
  };

  const onToggleStudentVisibility = (studentId) => {
    setVisibilitySettings((prev) => {
      const students = prev.students.includes(studentId)
        ? prev.students.filter((id) => id !== studentId)
        : [...prev.students, studentId];
      return { ...prev, students };
    });
  };

  const onSaveVisibility = async () => {
    setVisibilityLoading(true);
    setVisibilityMessage(null);
    try {
      const res = await axios.post('http://localhost/sfgs_api/api/result_visibility.php', visibilitySettings);
      setVisibilitySettings(res.data);
      setVisibilityMessage({ type: 'success', text: 'Visibility updated.' });
    } catch (error) {
      setVisibilityMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update visibility.' });
    } finally {
      setVisibilityLoading(false);
    }
  };

  // Term Dates change handlers
  const onEndOfTermChange = (date) => {
    setTermDates((prev) => ({ ...prev, endOfTerm: date }));
  };

  const onNextTermStartChange = (date) => {
    setTermDates((prev) => ({ ...prev, nextTermStart: date }));
  };

  const onSaveTermDates = async () => {
    setTermDatesLoading(true);
    setTermDatesMessage(null);
    try {
      const res = await axios.post('http://localhost/sfgs_api/api/term_dates.php', termDates);
      setTermDates(res.data);
      setTermDatesMessage({ type: 'success', text: 'Term dates saved.' });
    } catch (error) {
      setTermDatesMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save term dates.' });
    } finally {
      setTermDatesLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 mt-20 space-y-10">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
          Result Publish Management
        </h1>

        {/* Result Calculation */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
          <ResultCalculationForm
            classes={classes}
            terms={terms}
            sessions={sessions}
            selectedClass={selectedClass}
            selectedTerm={selectedTerm}
            selectedSession={selectedSession}
            onClassChange={setSelectedClass}
            onTermChange={setSelectedTerm}
            onSessionChange={setSelectedSession}
            onCalculate={handleCalculateResults}
            loading={calcLoading}
            message={calcMessage}
          />
        </div>

        {/* Visibility and Term Dates */}
        <div className="grid md:grid-cols-2 gap-6">
          <ResultVisibilityControl
            classes={classes}
            students={students}
            visibilitySettings={visibilitySettings}
            onToggleClassVisibility={onToggleClassVisibility}
            onToggleStudentVisibility={onToggleStudentVisibility}
            onSaveVisibility={onSaveVisibility}
            saving={visibilityLoading}
            message={visibilityMessage}
          />

          <TermDateSetter
            endOfTerm={termDates.endOfTerm}
            nextTermStart={termDates.nextTermStart}
            onEndOfTermChange={onEndOfTermChange}
            onNextTermStartChange={onNextTermStartChange}
            onSaveDates={onSaveTermDates}
            saving={termDatesLoading}
            message={termDatesMessage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ResultPublishPage;
