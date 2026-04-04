import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../Styles/Auth.css';
import apiClient from '../../api/apiClient.ts';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        token: '',
        newPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setForm(prev => ({ ...prev, token }));
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setResponseMessage('');
            setLoading(true);
            const data = {
                Token: form.token,
                NewPassword: form.newPassword
            };
            const response = await apiClient.post('/Auth/reset-password', data);
            setForm(prev => ({ ...prev, newPassword: '' }));
            setResponseMessage(response.data.message);
        } catch (error) {
            console.error('Reset password failed:', error);
            setResponseMessage('Failed to reset password. Invalid/Expired token.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Reset Password</h2>
                    <p>Enter your token and new password</p>
                </div>
                {responseMessage && <div className={`response-message ${responseMessage.includes('successfully') ? 'response-success' : 'response-error'}`}>{responseMessage}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Token */}
                    <div className="form-group d-none">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="token"
                                value={form.token}
                                onChange={handleChange}
                                required
                                placeholder=""
                                readOnly
                            />
                            <label>Token</label>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="form-group">
                        <div className="input-wrapper password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                required
                                placeholder=""
                            />
                            <label>New Password</label>
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`btn auth-btn ${loading ? 'loading' : ''}`}
                    >
                        <span className="btn-text">Reset Password</span>
                        <span className="btn-loader"></span>
                    </button>
                </form>

                <div className="signup-link">
                    <p>
                        Remember your password? <a href="/">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;