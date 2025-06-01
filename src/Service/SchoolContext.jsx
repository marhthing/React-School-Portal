import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { apiRequest } from "./apiUtils"; // Import the utility

const SchoolContext = createContext();

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
};

export const SchoolProvider = ({ children }) => {
  const [schoolData, setSchoolData] = useState(() => {
    // Initialize from localStorage if available
    try {
      const cached = localStorage.getItem("schoolData");
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if data is not older than 1 hour
        const oneHour = 60 * 60 * 1000;
        if (parsed.timestamp && Date.now() - parsed.timestamp < oneHour) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn("Failed to parse cached school data:", error);
    }

    // Default school data
    return {
      school_name: "Loading...",
      school_abbreviation: "",
      school_address: "",
      school_logo_url: "/assets/logo.png",
      phone: "",
      email: "",
      website: "",
      motto: "",
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchoolData = useCallback(
    async (force = false) => {
      // Don't fetch if we have recent data and it's not forced
      if (!force && schoolData.school_name !== "Loading...") {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching school data from /school-settings.php');
        
        // Use the utility to make the API call
        const response = await apiRequest('/school-settings.php');

        console.log('School data response:', response);

        if (response.status === "success" && response.data) {
          const newData = response.data;
          setSchoolData(newData);

          // Cache the data with timestamp
          try {
            localStorage.setItem(
              "schoolData",
              JSON.stringify({
                data: newData,
                timestamp: Date.now(),
              })
            );
          } catch (storageError) {
            console.warn("Failed to cache school data:", storageError);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch school data:", err);
        setError(err.message || "Failed to load school information");

        // Keep default data if fetch fails
        if (schoolData.school_name === "Loading...") {
          setSchoolData({
            school_name: "Your School Name",
            school_abbreviation: "YSN",
            school_address: "School Address",
            school_logo_url: "/assets/logo.png",
            phone: "",
            email: "",
            website: "",
            motto: "Excellence in Education",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [schoolData.school_name]
  );

  // Fetch school data on mount
  useEffect(() => {
    if (schoolData.school_name === "Loading...") {
      fetchSchoolData();
    }
  }, [fetchSchoolData, schoolData.school_name]);

  const refreshSchoolData = useCallback(() => {
    return fetchSchoolData(true);
  }, [fetchSchoolData]);

  // Memoize context value
  const value = useMemo(
    () => ({
      schoolData,
      loading,
      error,
      refreshSchoolData,
      fetchSchoolData,
    }),
    [schoolData, loading, error, refreshSchoolData, fetchSchoolData]
  );

  return (
    <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
  );
};