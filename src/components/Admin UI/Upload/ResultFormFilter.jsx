import React from "react";
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
  // Convert array to options format
  const toOptions = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item) =>
      typeof item === "string"
        ? { value: item, label: item }
        : { value: item.id, label: item.name }
    );
  };

  const classOptions = toOptions(classesList);
  const termOptions = toOptions(termsList);
  const sessionOptions = toOptions(sessionsList);

const safeClassKey = selectedClass?.toString() || "";
const classKey = Number(selectedClass);  // convert selectedClass to number
const subjects =
  selectedClass && subjectsByClass[classKey]
    ? subjectsByClass[classKey]
    : [];


const subjectOptions = subjects.map((subj) => ({
  value: subj.id,
  label: subj.name,
}));




  // Reset subject when class changes
  React.useEffect(() => {
    onSubjectChange("");
  }, [selectedClass, onSubjectChange]);

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Class */}
      <div>
        <label
          htmlFor="class-select"
          className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
        >
          Class
        </label>
        <Select
          inputId="class-select"
          aria-label="Select Class"
          options={classOptions}
          value={classOptions.find((opt) => opt.value === selectedClass) || null}
          onChange={(option) => onClassChange(option?.value ?? "")}
          placeholder="Select Class"
          isClearable
          styles={customStyles}
        />
      </div>

      {/* Subject */}
      <div>
  <label
    htmlFor="subject-select"
    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
  >
    Subject
  </label>
  <Select
    inputId="subject-select"
    aria-label="Select Subject"
    options={subjectOptions}
    value={subjectOptions.find((opt) => opt.value === selectedSubject) || null}
    onChange={(option) => onSubjectChange(option?.value ?? "")}
    placeholder="Select Subject"
    isClearable
    isDisabled={!selectedClass}
    styles={customStyles}
  />
</div>

      {/* Term */}
      <div>
        <label
          htmlFor="term-select"
          className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
        >
          Term
        </label>
        <Select
          inputId="term-select"
          aria-label="Select Term"
          options={termOptions}
          value={termOptions.find((opt) => opt.value === selectedTerm) || null}
          onChange={(option) => onTermChange(option?.value ?? "")}
          placeholder="Select Term"
          isClearable
          styles={customStyles}
        />
      </div>

      {/* Session */}
      <div>
        <label
          htmlFor="session-select"
          className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
        >
          Session
        </label>
        <Select
          inputId="session-select"
          aria-label="Select Session"
          options={sessionOptions}
          value={sessionOptions.find((opt) => opt.value === selectedSession) || null}
          onChange={(option) => onSessionChange(option?.value ?? "")}
          placeholder="Select Session"
          isClearable
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default ResultFormFilter;
