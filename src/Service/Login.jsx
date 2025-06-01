import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./apiUtils"; // Import the utility
import { useUser } from "./UserContext";
import { useSchool } from "./SchoolContext";
import { getDashboardRoute } from "./roleUtils"; // Import centralized utility

const Login = () => {
  const navigate = useNavigate();
  const { user, login, loading: userLoading, setLoading } = useUser();
  const { schoolData } = useSchool();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user?.role && !userLoading) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute, { replace: true });
    }
  }, [user, userLoading, navigate]);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return (
      formData.identifier.trim().length >= 3 &&
      formData.password.trim().length >= 6
    );
  }, [formData.identifier, formData.password]);

  // Optimized input handler
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (error) {
        setError("");
      }
    },
    [error]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isFormValid) {
        setError("Please enter valid credentials (minimum 3 characters for ID, 6 for password)");
        return;
      }

      setIsSubmitting(true);
      setLoading(true);
      setError("");

      try {
        const credentials = {
          identifier: formData.identifier.trim(),
          password: formData.password.trim(),
        };

        // Make the API call using the utility
        const response = await apiRequest('/login.php', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });

        if (response.status === "success" && response.user) {
          // Use context login method
          login(response.user);
          // Navigation will be handled by useEffect above
        } else {
          const errorMsg = response.message || "Login failed. Please try again.";
          setError(errorMsg);
        }
      } catch (err) {
        let errorMessage = "Network error. Please check your connection and try again.";

        if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
        setLoading(false);
      }
    },
    [formData, isFormValid, login, setLoading]
  );

  // Prevent form submission on Enter if form is invalid
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !isFormValid) {
        e.preventDefault();
      }
    },
    [isFormValid]
  );

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600"></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* School Header */}
        <div className="text-center mb-6">
          {schoolData.school_logo_url && (
            <img
              src={schoolData.school_logo_url}
              alt={`${schoolData.school_name} Logo`}
              className="h-16 w-16 mx-auto mb-3 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <h1 className="text-xl font-bold text-gray-800">
            {schoolData.school_name}
          </h1>
          {schoolData.motto && (
            <p className="text-sm text-gray-600 italic">{schoolData.motto}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-center text-gray-700">
            Login to Your Account
          </h2>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Registration Number or Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={formData.identifier}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your registration number or email"
              required
              disabled={isSubmitting}
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {schoolData.school_abbreviation && (
            <p>
              &copy; 2025 {schoolData.school_abbreviation}. All rights reserved.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;