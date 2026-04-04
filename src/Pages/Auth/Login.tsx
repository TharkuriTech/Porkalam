import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Auth.css';
import apiClient from '../../api/apiClient.ts';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: '',
        remember: false
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setResponseMessage('');
            setLoading(true);
            const data = {
                username: form.username,
                password: form.password
            };
            const response = await apiClient.post('/Auth/login', data);
            
            if (response.data && response.data.token) {
                // Store user data and token in localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('token', response.data.token);
                
                // Redirect to home page
                navigate('/home');
            }
            return response.data;
        }
        catch (error) {
            //console.error('Login failed:', error);
            setResponseMessage('The login information you entered is incorrect.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>
                {responseMessage && <div className="response-message response-error">{responseMessage}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="form-group">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                placeholder=""
                            />
                            <label>Username/Email/Phone</label>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <div className="input-wrapper password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder=""
                            />
                            <label>Password</label>

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
                            </button>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="form-options">
                        <label className="remember-wrapper">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={form.remember}
                                onChange={handleChange}
                            />
                            <span className="checkbox-label">
                                <span className="checkmark"></span>
                                Remember me
                            </span>
                        </label>

                        <a href="/forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`btn auth-btn ${loading ? 'loading' : ''}`}
                    >
                        <span className="btn-text">Sign In</span>
                        <span className="btn-loader"></span>
                    </button>

                </form>

                <div className="signup-link">
                    <p>
                        Don’t have an account? <a href="/register">Sign up</a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;