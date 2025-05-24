import React, { useEffect, useState } from "react";
import Select from "react-select";

const ResultFormFilter = ({
  selectedClass,
  onClassChange,
  selectedSubject,
  onSubjectChange,
  selectedTerm,
  onTermChange,
  selectedSession,
  onSessionChange,
  classesList = [],
  termsList = [],
  sessionsList = [],
  subjectsByClass = {},
}) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (selectedClass && subjectsByClass[selectedClass]) {
      setSubjects(subjectsByClass[selectedClass]);
    } else {
      setSubjects([]);
    }
    onSubjectChange("");
  }, [selectedClass, onSubjectChange, subjectsByClass]);

  const toOptions = (arr) => arr.map((item) => ({ value: item, label: item }));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--tw-bg)",
      borderColor: state.isFocused ? "#3b82f6" : "var(--tw-border)",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      color: "var(--tw-text)",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--tw-bg)",
      color: "var(--tw-text)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "var(--tw-bg-hover)"
        : "var(--tw-bg)",
      color: "var(--tw-text)",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--tw-text)",
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--tw-placeholder)",
    }),
  };

  const commonClassNames = {
  control: () => "bg-white dark:bg-gray-700 text-black dark:text-white",
  menu: () => "bg-white dark:bg-gray-700",
};

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {/* Class */}
    <div>
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300" htmlFor="class-select">
        Class
      </label>
      <Select
        inputId="class-select"
        options={toOptions(classesList)}
        value={selectedClass ? { value: selectedClass, label: selectedClass } : null}
        onChange={(option) => onClassChange(option?.value || "")}
        placeholder="Select Class"
        styles={customStyles}
        isClearable
        classNames={commonClassNames}
      />
    </div>

    {/* Subject */}
    <div>
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300" htmlFor="subject-select">
        Subject
      </label>
      <Select
        inputId="subject-select"
        options={toOptions(subjects)}
        value={selectedSubject ? { value: selectedSubject, label: selectedSubject } : null}
        onChange={(option) => onSubjectChange(option?.value || "")}
        placeholder="Select Subject"
        styles={customStyles}
        isClearable
        isDisabled={!selectedClass}
        classNames={commonClassNames}  // added here
      />
    </div>

    {/* Term */}
    <div>
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300" htmlFor="term-select">
        Term
      </label>
      <Select
        inputId="term-select"
        options={toOptions(termsList)}
        value={selectedTerm ? { value: selectedTerm, label: selectedTerm } : null}
        onChange={(option) => onTermChange(option?.value || "")}
        placeholder="Select Term"
        styles={customStyles}
        isClearable
        classNames={commonClassNames}  // added here
      />
    </div>

    {/* Session */}
    <div>
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300" htmlFor="session-select">
        Session
      </label>
      <Select
        inputId="session-select"
        options={toOptions(sessionsList)}
        value={selectedSession ? { value: selectedSession, label: selectedSession } : null}
        onChange={(option) => onSessionChange(option?.value || "")}
        placeholder="Select Session"
        styles={customStyles}
        isClearable
        classNames={commonClassNames}  // added here
      />
    </div>
  </div>
);

};

export default ResultFormFilter;
