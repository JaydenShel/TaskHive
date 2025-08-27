import { useState } from 'react';
import '../../Style/s_options.css';

function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setMessage('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        setMessage('');

        // Mock API call - you'll need to implement the backend endpoint
        setTimeout(() => {
            setMessage('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="settings-section">
            <div className="section-card">
                <h3>Change Password</h3>
                <p>Update your password to keep your account secure</p>
                
                <form onSubmit={handlePasswordChange} className="settings-form">
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <small className="form-help">
                            Password must be at least 8 characters long
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            <div className="section-card">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">Two-Factor Authentication</span>
                        <span className="setting-description">Use an authenticator app or SMS for login</span>
                    </div>
                    <button className="toggle-btn">Enable</button>
                </div>
            </div>

            <div className="section-card">
                <h3>Login Sessions</h3>
                <p>Manage your active login sessions</p>
                
                <div className="session-item">
                    <div className="session-info">
                        <span className="session-device">Current Session</span>
                        <span className="session-details">This device • Just now</span>
                    </div>
                    <span className="session-status active">Active</span>
                </div>

                <div className="session-item">
                    <div className="session-info">
                        <span className="session-device">Mobile Device</span>
                        <span className="session-details">iPhone • 2 hours ago</span>
                    </div>
                    <button className="session-revoke">Revoke</button>
                </div>
            </div>
        </div>
    );
}

export default SecuritySettings;
