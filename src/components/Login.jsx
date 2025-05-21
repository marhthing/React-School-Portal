import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for stored session
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.role) {
      redirectToDashboard(userData.role);
    }
  }, []);

  const redirectToDashboard = (role) => {
    if (role === 'admin') navigate('/adminDashboard');
    else if (role === 'student') navigate('/studentDashboard');
    else if (role === 'teacher') navigate('/teacherDashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost/sfgs_api/login.php', {
        login_id: loginId,
        login_password: password,
      }, { withCredentials: true });

      const data = response.data;
      if (data.success) {
        localStorage.setItem('userData', JSON.stringify({ id: data.id, role: data.role }));
        redirectToDashboard(data.role);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold text-center mb-4">Login</h2>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <input
          type="text"
          placeholder="Registration Number or Email"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
        />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 w-full rounded">
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
