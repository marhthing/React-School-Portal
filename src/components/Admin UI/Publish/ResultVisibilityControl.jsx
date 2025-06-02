import React, { useState, useEffect, useCallback } from 'react';

const ResultVisibilityControl = ({
  classes = [],
  students = [],
  terms = [],
  sessions = [],
  initialTermName = '',
  initialSessionId = null,
  visibilitySettings = { classes: [], students: [] },
  onToggleClassVisibility,
  onToggleStudentVisibility,
  onTermSessionChange,
  onSaveVisibility,
  saving,
  message,
}) => {
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(initialTermName);
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessionId);
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [studentsWithVisibility, setStudentsWithVisibility] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [localVisibilityState, setLocalVisibilityState] = useState(visibilitySettings);

  // Update local state when props change
  useEffect(() => {
    setSelectedTerm(initialTermName);
    setSelectedSessionId(initialSessionId);
  }, [initialTermName, initialSessionId]);

  // Update local visibility state when props change
  useEffect(() => {
    setLocalVisibilityState(visibilitySettings);
  }, [visibilitySettings]);

  // Fetch students with visibility status when filters change
  const fetchStudentsWithVisibility = useCallback(async () => {
    // Don't fetch students if no class is selected
    if (!selectedTerm || !selectedSessionId || !selectedClassFilter) {
      setStudentsWithVisibility([]);
      return;
    }
    
    setLoadingStudents(true);
    try {
      const params = new URLSearchParams({
        term: selectedTerm,
        session_id: selectedSessionId,
        class_id: selectedClassFilter
      });

      const response = await fetch(`http://localhost/sfgs_api/api/result_students.php?${params}`);
      const data = await response.json();
      
      if (data.success) {
        // Merge students with their visibility status from API response
        const studentsWithStatus = (data.students || []).map(student => ({
          ...student,
          isVisible: student.is_visible || false // Use the is_visible field from API
        }));
        setStudentsWithVisibility(studentsWithStatus);
      } else {
        console.error('Failed to fetch students:', data.error);
        setStudentsWithVisibility([]);
      }
    } catch (error) {
      console.error('Error fetching students with visibility:', error);
      setStudentsWithVisibility([]);
    } finally {
      setLoadingStudents(false);
    }
  }, [selectedTerm, selectedSessionId, selectedClassFilter]);

  // Fetch students when filters change
  useEffect(() => {
    fetchStudentsWithVisibility();
  }, [selectedTerm, selectedSessionId, selectedClassFilter]);

  // Update students visibility when local visibility state changes
  useEffect(() => {
    if (studentsWithVisibility.length > 0) {
      setStudentsWithVisibility(prev => 
        prev.map(student => ({
          ...student,
          isVisible: (localVisibilityState.students || []).includes(student.regNumber)
        }))
      );
    }
  }, [localVisibilityState.students]);

  // Filter students by search query
  const filteredStudents = studentsWithVisibility.filter((student) => {
    const fullName = student.fullName || student.student_name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
    return fullName.toLowerCase().includes(studentSearch.toLowerCase());
  });

  // Notify parent when term or session changes
  useEffect(() => {
    if (selectedTerm && selectedSessionId !== null && onTermSessionChange) {
      onTermSessionChange({ termName: selectedTerm, sessionId: selectedSessionId });
    }
  }, [selectedTerm, selectedSessionId, onTermSessionChange]);

  // When user changes term in dropdown
  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
    // Reset class filter when term changes
    setSelectedClassFilter('');
  };

  // When user changes session in dropdown
  const handleSessionChange = (e) => {
    const val = e.target.value;
    setSelectedSessionId(val === '' ? null : Number(val));
    // Reset class filter when session changes
    setSelectedClassFilter('');
  };

  // When user changes class filter
  const handleClassFilterChange = (e) => {
    setSelectedClassFilter(e.target.value);
  };

  // Get class name for display
  const getClassName = (classId) => {
    const cls = classes.find(c => String(c.id) === String(classId));
    return cls?.name || `Class ${classId}`;
  };

  // Get student's class name
  const getStudentClassName = (student) => {
    if (student.class_name) {
      return student.class_name;
    }
    
    const cls = classes.find(c => c.id === student.class_id);
    return cls?.name || 'Unknown Class';
  };

  // Handle individual student visibility toggle
  const handleStudentVisibilityToggle = (regNumber) => {
    // Update local state immediately for better UX
    setLocalVisibilityState(prev => {
      const students = prev.students || [];
      const newStudents = students.includes(regNumber)
        ? students.filter(id => id !== regNumber)
        : [...students, regNumber];
      return { ...prev, students: newStudents };
    });

    // Also update the students display immediately
    setStudentsWithVisibility(prev => 
      prev.map(student => 
        student.regNumber === regNumber 
          ? { ...student, isVisible: !student.isVisible }
          : student
      )
    );

    // Call parent toggle function
    onToggleStudentVisibility(regNumber);
  };

  // Handle class visibility toggle - FIXED: Ensure consistent type handling
  const handleClassVisibilityToggle = (classId) => {
    // Convert to string for consistency
    const classIdStr = String(classId);
    
    // Update local state immediately
    setLocalVisibilityState(prev => {
      const classes = (prev.classes || []).map(id => String(id)); // Normalize to strings
      const newClasses = classes.includes(classIdStr)
        ? classes.filter(id => id !== classIdStr)
        : [...classes, classIdStr];
      return { ...prev, classes: newClasses };
    });

    // Call parent toggle function with original format
    onToggleClassVisibility(classId);
  };

  // Helper function to check if class is visible - FIXED: Handle type consistency
  const isClassVisible = (classId) => {
    const visibleClasses = (localVisibilityState.classes || []).map(id => String(id));
    return visibleClasses.includes(String(classId));
  };

  // Count visible students in current filter
  const visibleStudentsCount = filteredStudents.filter(student => student.isVisible).length;

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Result Visibility Control
      </h2>

      {/* Select Term and Session */}
      <div className="mb-6 flex flex-col md:flex-row md:space-x-6">
        <div className="mb-4 md:mb-0">
          <label
            className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
            htmlFor="term-select"
          >
            Select Term
          </label>
          <select
            id="term-select"
            value={selectedTerm}
            onChange={handleTermChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="" disabled>
              -- Select Term --
            </option>
            {terms.map((term) => (
              <option key={term.name} value={term.name}>
                {term.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
            htmlFor="session-select"
          >
            Select Session
          </label>
          <select
            id="session-select"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={selectedSessionId || ''}
            onChange={handleSessionChange}
          >
            <option value="" disabled>
              -- Select Session --
            </option>
            {sessions.map((session, idx) => (
              <option key={session.id ?? `session-${idx}`} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Class Visibility Toggles - FIXED: Use helper function for consistent checking */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
          Classes ({(localVisibilityState.classes || []).length} visible)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {classes.map((cls) => {
            const enabled = isClassVisible(cls.id); // Use helper function
            return (
              <label key={cls.id} className="inline-flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleClassVisibilityToggle(cls.id)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-200 font-medium">
                  {cls.name}
                </span>
              </label>
            );
          })}
        </div>
        {classes.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 italic">No classes available.</p>
        )}
      </div>

      {/* Individual Student Visibility */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
          Individual Students ({visibleStudentsCount} visible)
        </h3>

        {/* Class Filter - REQUIRED */}
        <div className="mb-4">
          <label
            className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
            htmlFor="class-filter"
          >
            Filter by Class <span className="text-red-500">*</span>
          </label>
          <select
            id="class-filter"
            value={selectedClassFilter}
            onChange={handleClassFilterChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">-- Select a Class to View Students --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {!selectedClassFilter && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              Please select a class to view and manage individual student visibility.
            </p>
          )}
        </div>

        {/* Only show search and students if class is selected */}
        {selectedClassFilter && (
          <>
            {/* Search box */}
            <input
              type="text"
              placeholder="Search students by name"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />

            <div className="max-h-64 overflow-y-auto border rounded p-3 bg-gray-50 dark:bg-gray-900 dark:border-gray-600">
              {loadingStudents ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Loading students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  {studentsWithVisibility.length === 0 ? 'No students with results found for the selected class, term, and session.' : 'No students found matching your search.'}
                </p>
              ) : (
                filteredStudents.map((student) => {
                  const fullName = student.fullName || student.student_name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
                  const enabled = student.isVisible;
                  
                  return (
                    <label
                      key={student.regNumber}
                      className="flex items-center justify-between p-2 mb-2 cursor-pointer rounded hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          {fullName}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                          ({getStudentClassName(student)}) - {student.regNumber}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleStudentVisibilityToggle(student.regNumber)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 ml-3"
                      />
                    </label>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={onSaveVisibility}
        disabled={saving || !selectedTerm || !selectedSessionId}
        className={`mt-6 w-full py-3 px-4 rounded text-white font-semibold transition-colors ${
          saving || !selectedTerm || !selectedSessionId
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500'
        }`}
      >
        {saving ? 'Saving...' : 'Save Visibility Settings'}
      </button>

      {(!selectedTerm || !selectedSessionId) && (
        <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
          Please select both term and session before saving.
        </p>
        )}

      {/* Feedback Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-50 border-red-400 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}
    </section>
  );
};

export default ResultVisibilityControl;