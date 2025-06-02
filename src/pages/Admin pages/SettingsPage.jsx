import React, { useEffect, useState } from "react";
import SchoolInfoTable from "../../components/Admin UI/Settings/SchoolInfoTable";
import AcademicInfoTable from "../../components/Admin UI/Settings/AcademicInfoTable";
import PlatformToggles from "../../components/Admin UI/Settings/PlatformToggles";
import SettingsModal from "../../components/Admin UI/Settings/SettingsModal";
import ConfirmDeleteModal from "../../components/Admin UI/Settings/ConfirmDeleteModal";
import AdminLayout from '../../components/ui/AdminLayout';

const SettingsPage = () => {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [academicInfo, setAcademicInfo] = useState(null);
  const [platformToggles, setPlatformToggles] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalType, setModalType] = useState(""); // "school" or "academic"
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_BASE_URL = "http://localhost/sfgs_api/api/settings.php";

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      
      const res = await fetch(`${API_BASE_URL}?action=all`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to fetch settings');
      }

      // Set data from database
      setSchoolInfo(data.schoolInfo || null);
      setAcademicInfo(data.academicInfo || null);
      setPlatformToggles(data.platformToggles || null);
      
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Keep null values - let components handle empty states gracefully
    } finally {
      setLoading(false);
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
    try {
      console.log("Submitting formData:", formData);

      let url = "";
      let method = "";
      let requestBody = new FormData();

      if (modalType === "school") {
        url = `${API_BASE_URL}?action=school`;
        method = modalMode === "add" ? "POST" : "PUT";
        
        // Handle text fields
        requestBody.append('school_full_name', formData.school_full_name || formData.full_name || '');
        requestBody.append('school_abbreviation', formData.school_abbreviation || formData.abbreviation || '');
        requestBody.append('school_address', formData.school_address || formData.address || '');
        requestBody.append('phone', formData.phone || '');
        requestBody.append('email', formData.email || '');
        requestBody.append('website', formData.website || '');
        requestBody.append('motto', formData.motto || '');
        
        // Handle file uploads
        if (formData.school_logo && formData.school_logo instanceof File) {
          requestBody.append('school_logo', formData.school_logo);
        }
        if (formData.school_signature && formData.school_signature instanceof File) {
          requestBody.append('school_signature', formData.school_signature);
        }
        
      } else if (modalType === "academic") {
        url = `${API_BASE_URL}?action=academic`;
        method = modalMode === "add" ? "POST" : "PUT";
        requestBody.append('current_session', formData.current_session);
        requestBody.append('current_term', formData.current_term);
      }

      const res = await fetch(url, {
        method: method,
        credentials: 'include',
        body: requestBody
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      
      if (result.error) {
        throw new Error(result.message || `Failed to ${modalMode} ${modalType} information`);
      }

      if (result.success) {
        // Refresh data and close modal
        await fetchSettingsData();
        handleCloseModal();
      }
      
    } catch (error) {
      console.error("Error updating settings:", error);
      // Could show a toast notification here instead of state error
    }
  };

  const handleDeleteSchoolInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}?action=school`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      
      if (result.error) {
        throw new Error(result.message || 'Failed to delete school information');
      }

      if (result.success) {
        await fetchSettingsData();
        setDeleteModalOpen(false);
      }
      
    } catch (error) {
      console.error("Error deleting school info:", error);
    }
  };

  const handleToggleChange = async (key, value) => {
    try {
      const res = await fetch(`${API_BASE_URL}?action=platform`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      
      if (result.error) {
        throw new Error(result.message || 'Failed to update platform settings');
      }

      if (result.success) {
        await fetchSettingsData();
      }
      
    } catch (error) {
      console.error("Error updating toggle:", error);
      // Refresh to restore actual state
      await fetchSettingsData();
    }
  };

  // Simple loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64 mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

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
        {platformToggles && (
          <PlatformToggles
            toggles={platformToggles}
            onToggleChange={handleToggleChange}
          />
        )}

        {/* Modals */}
        {modalOpen && (
          <SettingsModal
            type={modalType}
            mode={modalMode}
            initialValues={selectedData}
            onSubmit={handleSubmitModal}
            onClose={handleCloseModal}
          />
        )}

        {deleteModalOpen && (
          <ConfirmDeleteModal
            onConfirm={handleDeleteSchoolInfo}
            onCancel={() => setDeleteModalOpen(false)}
            message="Are you sure you want to delete the school information? This action cannot be undone."
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;