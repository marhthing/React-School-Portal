import React, { useEffect, useState } from "react";
import SchoolInfoTable from "../../components/Admin UI/Settings/SchoolInfoTable";
import AcademicInfoTable from "../../components/Admin UI/Settings/AcademicInfoTable";
import PlatformToggles from "../../components/Admin UI/Settings/PlatformToggles";
import SettingsModal from "../../components/Admin UI/Settings/SettingsModal";
import ConfirmDeleteModal from "../../components/Admin UI/Settings/ConfirmDeleteModal";
import AdminLayout from "../../components/AdminLayout";

const SettingsPage = () => {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [academicInfo, setAcademicInfo] = useState(null);
  const [platformToggles, setPlatformToggles] = useState({
    disable_student_login: 0,
    maintenance_mode: 0,
    enable_result_uploads: 1,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalType, setModalType] = useState(""); // "school" or "academic"
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      // Mock API fallback
      const dummyData = {
        schoolInfo: {
          full_name: "Demo High School",
          abbreviation: "DHS",
          logo: "/images/logo.png",
          signature: "Principal Signature",
        },
        academicInfo: {
          current_term: "2nd Term",
          current_session: "2024/2025",
        },
        platformToggles: {
          disable_student_login: 0,
          maintenance_mode: 0,
          enable_result_uploads: 1,
        },
      };

      // Comment out below block if you're testing offline
      /*
      const res = await fetch("/api/settings/fetch_all.php");
      const data = await res.json();
      */

      const data = dummyData; // Use dummy data for now
      setSchoolInfo(data.schoolInfo || null);
      setAcademicInfo(data.academicInfo || null);
      setPlatformToggles(data.platformToggles || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleOpenModal = (type, mode, data = null) => {
    setModalType(type);
    setModalMode(mode);
    setSelectedData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedData(null);
  };

  const handleSubmitModal = async (formData) => {
    console.log("Submitting formData:", formData);
    // Simulate backend update
    if (modalType === "school") {
      setSchoolInfo(formData);
    } else if (modalType === "academic") {
      setAcademicInfo(formData);
    }
    handleCloseModal();
  };

  const handleDeleteSchoolInfo = async () => {
    // Simulate deletion
    setSchoolInfo(null);
    setDeleteModalOpen(false);
  };

  const handleToggleChange = async (key, value) => {
    // Simulate backend toggle update
    setPlatformToggles((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-8 mt-20">
        {/* School Info Table */}
        <SchoolInfoTable
          data={schoolInfo}
          onAdd={() => handleOpenModal("school", "add")}
          onEdit={() => handleOpenModal("school", "edit", schoolInfo)}
          onDelete={() => setDeleteModalOpen(true)}
        />

        {/* Academic Info Table */}
        <AcademicInfoTable
          data={academicInfo}
          onAdd={() => handleOpenModal("academic", "add")}
          onEdit={() => handleOpenModal("academic", "edit", academicInfo)}
        />

        {/* Platform Toggles */}
        <PlatformToggles
          toggles={platformToggles}
          onToggleChange={handleToggleChange}
        />

        {/* Reusable Modal */}
        {modalOpen && (
     <SettingsModal
  type={modalType}   // pass modalType here
  mode={modalMode}
  initialValues={selectedData}
  onSubmit={handleSubmitModal}
  onClose={handleCloseModal}
/>
        )}

        {/* Confirm Delete Modal */}
        {deleteModalOpen && (
          <ConfirmDeleteModal
            onConfirm={handleDeleteSchoolInfo}
            onCancel={() => setDeleteModalOpen(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
