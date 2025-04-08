import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset thông báo trước khi gửi yêu cầu
    setLoading(true); // Bật trạng thái loading

    // Debug: Kiểm tra dữ liệu gửi đi
    console.log('Sending register request with:', { username, email, password });

    try {
      const res = await axios.post('http://localhost:3001/api/users/register', {
        username,
        email,
        password,
      });

      // Debug: Kiểm tra phản hồi từ server
      console.log('Register response:', res.data);

      // Kiểm tra xem đăng ký có thành công không (dựa trên mã trạng thái hoặc dữ liệu trả về)
      if (res.status === 201) {
        setMessage('Registration successful! Please login.');
      } else {
        setMessage('Registration failed: Unexpected response from server');
      }
    } catch (err) {
      // Debug: Kiểm tra lỗi
      console.error('Register error:', err);

      // Xử lý lỗi chi tiết hơn
      if (err.response) {
        // Lỗi từ server (có phản hồi, ví dụ: 400, 500)
        setMessage(err.response.data.message || 'Registration failed');
      } else if (err.request) {
        // Yêu cầu đã gửi nhưng không nhận được phản hồi (lỗi mạng)
        setMessage('Registration failed: No response from server. Please check your network.');
      } else {
        // Lỗi khác (ví dụ: lỗi trong code)
        setMessage('Registration failed: ' + err.message);
      }
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;