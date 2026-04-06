import React, { useState } from 'react';
import '../../Styles/Auth.css';
import apiClient from '../../api/apiClient.ts';
import { getIPAddress } from '../../Util/Util.ts';

const ForgotPassword: React.FC = () => {
    const [form, setForm] = useState({
        username: ''
    });

    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

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
            const ipAddress = await getIPAddress();
            const data = {
                Username: form.username,
                IPAddress: ipAddress
            };
            const response = await apiClient.post('/Auth/forgot-password', data);
            setResponseMessage(response.data.message);
        } catch (error) {
            console.error('Forgot password failed:', error);
            setResponseMessage('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-body">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Forgot Password</h2>
                        <p>Enter your username to reset your password</p>
                    </div>
                    {responseMessage && <div className={`response-message ${responseMessage.includes('sent') ? 'response-success' : 'response-error'}`}>{responseMessage}</div>}
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
                                <label>Username/Email</label>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className={`btn auth-btn ${loading ? 'loading' : ''}`}
                        >
                            <span className="btn-text">Send Reset Link</span>
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
        </div>
    );
};

export default ForgotPassword;