import { useState } from 'react';
import '../../Style/s_options.css';

function PreferencesSettings() {
    const [preferences, setPreferences] = useState({
        theme: 'light',
        language: 'en',
        notifications: {
            email: true,
            push: false,
            sms: false
        },
        privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showLastSeen: true
        },
        display: {
            compactMode: false,
            showAvatars: true,
            autoRefresh: true
        }
    });

    const handlePreferenceChange = (category, key, value) => {
        setPreferences(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleSavePreferences = async () => {
        // Mock API call - you'll need to implement the backend endpoint
        console.log('Saving preferences:', preferences);
        // Show success message
        alert('Preferences saved successfully!');
    };

    return (
        <div className="settings-section">
            <div className="section-card">
                <h3>Appearance</h3>
                <p>Customize how TaskHive looks and feels</p>
                
                <div className="form-group">
                    <label htmlFor="theme">Theme</label>
                    <select
                        id="theme"
                        value={preferences.theme}
                        onChange={(e) => handlePreferenceChange('theme', null, e.target.value)}
                        className="form-select"
                    >
                        <option value="light">Light Theme</option>
                        <option value="dark">Dark Theme</option>
                        <option value="auto">Auto (System)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <select
                        id="language"
                        value={preferences.language}
                        onChange={(e) => handlePreferenceChange('language', null, e.target.value)}
                        className="form-select"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="zh">中文</option>
                    </select>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">Compact Mode</span>
                        <span className="setting-description">Reduce spacing for more content on screen</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={preferences.display.compactMode}
                            onChange={(e) => handlePreferenceChange('display', 'compactMode', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">Show Avatars</span>
                        <span className="setting-description">Display user profile pictures</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={preferences.display.showAvatars}
                            onChange={(e) => handlePreferenceChange('display', 'showAvatars', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="section-card">
                <h3>Notifications</h3>
                <p>Choose how you want to be notified about updates</p>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">Email Notifications</span>
                        <span className="setting-description">Receive updates via email</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={preferences.notifications.email}
                            onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">Push Notifications</span>
                        <span className="setting-description">Get real-time updates in your browser</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={preferences.notifications.push}
                            onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">SMS Notifications</span>
                        <span className="setting-description">Receive text message alerts</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={preferences.notifications.sms}
                            onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="section-card">
                <h3>Privacy</h3>
                <p>Control who can see your information</p>
                
                <div className="form-group">
                    <label htmlFor="profileVisibility">Profile Visibility</label>
                    <select
                        id="profileVisibility"
                        value={preferences.privacy.profileVisibility}
                        onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                        className="form-select"
                    >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">Show Email Address</span>
                        <span className="setting-description">Allow others to see your email</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={preferences.privacy.showEmail}
                            onChange={(e) => handlePreferenceChange('privacy', 'showEmail', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">Show Last Seen</span>
                        <span className="setting-description">Display when you were last active</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={preferences.privacy.showLastSeen}
                            onChange={(e) => handlePreferenceChange('privacy', 'showLastSeen', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="section-card">
                <h3>Performance</h3>
                <p>Optimize your TaskHive experience</p>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <span className="setting-label">Auto Refresh</span>
                        <span className="setting-description">Automatically update content</span>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={preferences.display.autoRefresh}
                            onChange={(e) => handlePreferenceChange('display', 'autoRefresh', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="settings-actions">
                <button onClick={handleSavePreferences} className="save-btn">
                    Save Preferences
                </button>
                <button 
                    onClick={() => setPreferences({
                        theme: 'light',
                        language: 'en',
                        notifications: { email: true, push: false, sms: false },
                        privacy: { profileVisibility: 'public', showEmail: false, showLastSeen: true },
                        display: { compactMode: false, showAvatars: true, autoRefresh: true }
                    })} 
                    className="reset-btn"
                >
                    Reset to Defaults
                </button>
            </div>
        </div>
    );
}

export default PreferencesSettings;