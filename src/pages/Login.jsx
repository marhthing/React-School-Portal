// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.role) {
      navigate(`/${userData.role}Dashboard`, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost/sfgs_api/login.php',
        {
          login_id: loginId,
          login_password: password,
        },
        { withCredentials: true }
      );

      const data = response.data;

      if (data.status === 'success' && data.role) {
        // Save user data to localStorage
        localStorage.setItem('userData', JSON.stringify({ id: data.id, role: data.role }));
        // Redirect based on role
        navigate(`/${data.role}Dashboard`, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold text-center mb-4">Login</h2>
        {error && (
          <div className="text-red-600 text-sm mb-2" role="alert">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Registration Number or Email"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 w-full rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
