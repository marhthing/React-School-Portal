import React, { useState, useEffect } from "react";
import Spinner from "../../ui/Spinner";
import { toast } from "react-hot-toast"; // if you're using toast

const initialFormState = {
  first_name: "",
  last_name: "",
  other_name: "",
  gender: "",
  dob_day: "",
  dob_month: "",
  dob_year: "",
  contact_phone: "",
  home_address: "",
  state: "",
  nationality: "",
  sponsor_name: "",
  sponsor_phone: "",
  sponsor_relationship: "",
  target_class: "",
};

const StudentModal = ({ mode, studentData = {}, onSubmit, onClose, classOptions, stateOptions }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formLoaded, setFormLoaded] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [hasChanged, setHasChanged] = useState(false);



  useEffect(() => {
  if (mode === "edit" && studentData) {
    const populatedData = {
      regNumber: studentData.regNumber || "",
      first_name: studentData.first_name || "",
      last_name: studentData.last_name || "",
      other_name: studentData.other_name || "",
      gender: studentData.gender || "",
      dob_day: studentData.dob_day || "",
      dob_month: studentData.dob_month || "",
      dob_year: studentData.dob_year || "",
      contact_phone: studentData.contact_phone || "",
      home_address: studentData.home_address || "",
      state: studentData.state || "",
      nationality: studentData.nationality || "",
      sponsor_name: studentData.sponsor_name || "",
      sponsor_phone: studentData.sponsor_phone || "",
      sponsor_relationship: studentData.sponsor_relationship || "",
      target_class: studentData.target_class || "",
    };
    setFormData(populatedData);
    setFormLoaded(true); // ✅ Data is ready
    setHasChanged(false); // ✅ No changes yet
  } else if (mode === "create") {
    setFormData(initialFormState);
    setFormLoaded(true);
  }
}, [mode, studentData]);



  const validate = () => {
    const errs = {};
    if (!formData.first_name.trim()) errs.first_name = "First Name is required";
    if (!formData.last_name.trim()) errs.last_name = "Last Name is required";
    if (!formData.gender.trim()) errs.gender = "Gender is required";
    if (!formData.dob_day.trim()) errs.dob_day = "Day of birth is required";
    if (!formData.dob_month.trim()) errs.dob_month = "Month of birth is required";
    if (!formData.dob_year.trim()) errs.dob_year = "Year of birth is required";
    if (!formData.contact_phone.trim()) errs.contact_phone = "Contact phone is required";
    if (!formData.home_address.trim()) errs.home_address = "Home address is required";
    if (!formData.state.trim()) errs.state = "State is required";
    if (!formData.nationality.trim()) errs.nationality = "Nationality is required";
    if (!formData.sponsor_name.trim()) errs.sponsor_name = "Sponsor name is required";
    if (!formData.sponsor_phone.trim()) errs.sponsor_phone = "Sponsor phone is required";
    if (!formData.sponsor_relationship.trim()) errs.sponsor_relationship = "Sponsor relationship is required";
    if (!formData.target_class.trim()) errs.target_class = "Targeted class is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((f) => {
    const newForm = { ...f, [name]: value };
    setHasChanged(true);
    return newForm;
  });
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    toast.error("Please fix the form errors.");
    return;
  }

  setIsSubmitting(true);
  try {
    await onSubmit(formData); // Ensure this is an async function from the parent
    toast.success(mode === "edit" ? "Student updated successfully!" : "Student registered successfully!");
    onClose(); // Optionally close the modal
  } catch (error) {
    toast.error("Something went wrong while saving the student.");
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};





  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {mode === "create" ? "Register New Student" : "Edit Student"}
        </h2>
{formLoaded ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">--select--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* First Name */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">First Name:</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter first name (surname)"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Last Name:</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Other Name */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Other Name:</label>
            <input
              type="text"
              name="other_name"
              placeholder="Enter other name (optional)"
              value={formData.other_name}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">D O B:</label>
            <div className="flex gap-2">
              <select
                name="dob_day"
                value={formData.dob_day}
                onChange={handleChange}
                required
                className="w-1/3 border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">--select--</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                name="dob_month"
                value={formData.dob_month}
                onChange={handleChange}
                required
                className="w-1/3 border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
               <option value="">--select--</option>
{[
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
].map((month, i) => (
  <option key={i} value={month}>{month}</option>
))}

              </select>
              <select
                name="dob_year"
                value={formData.dob_year}
                onChange={handleChange}
                required
                className="w-1/3 border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">--select--</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>

          {/* Contact & Address */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Contact Phone:</label>
            <input
              type="text"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Home Address:</label>
            <input
              type="text"
              name="home_address"
              value={formData.home_address}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* State & Nationality */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">State:</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">--select--</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Nationality:</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">--select--</option>
              <option value="Nigerian">Nigerian</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sponsor */}
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Sponsor's Name:</label>
            <input
              type="text"
              name="sponsor_name"
              value={formData.sponsor_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Sponsor's Phone:</label>
            <input
              type="text"
              name="sponsor_phone"
              value={formData.sponsor_phone}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-100">Sponsor Relationship:</label>
            <input
              type="text"
              name="sponsor_relationship"
              value={formData.sponsor_relationship}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Target Class */}
          <div>
  <label className="block font-medium text-gray-800 dark:text-gray-100">Target Class:</label>
  <select
    name="target_class"
    value={formData.target_class}
    onChange={handleChange}
    required
    className="w-full border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
  >
    <option value="">--select--</option>
    {classOptions.map((cls) => (
      <option key={cls.id} value={cls.id}>{cls.name}</option>
    ))}
  </select>
  {errors.target_class && <p className="text-red-500">{errors.target_class}</p>}
</div>


          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500">
              Cancel
            </button>
<button
  type="submit"
  disabled={!formLoaded || isSubmitting}
  className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2
    ${isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}
    ${!formLoaded ? "opacity-50 cursor-not-allowed" : ""}`}
>
  {isSubmitting ? (
  <>
    <Spinner size="sm" />
    <span>Submitting...</span>
  </>
) : (
  mode === "create" ? "Register" : "Update"
)}

</button>



          </div>
        </form>
        ) : (
  <div className="flex justify-center items-center py-10">
    <Spinner />
  </div>
)}
      </div>
    </div>
  );
};

export default StudentModal;
