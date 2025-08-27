import '../Style/s_profile.css';
import { useState, useContext } from 'react';
import { Context } from '../states/LoginContext';
import Settings from './Profile_Options/Settings.jsx';
import Account_Info from './Profile_Options/Account_Info.jsx';
import SecuritySettings from './Profile_Options/SecuritySettings.jsx';
import PreferencesSettings from './Profile_Options/PreferencesSettings.jsx';

function Profile() {
    const [selectedContent, setSelectedContent] = useState("account_info");
    const [isLoggedIn] = useContext(Context);

    const contentMap = {
        settings: <Settings />,
        account_info: <Account_Info />,
        security: <SecuritySettings />,
        preferences: <PreferencesSettings />
    };

    const menuItems = [
        { id: "account_info", label: "Account Info", icon: "👤" },
        { id: "security", label: "Security", icon: "🔒" },
        { id: "preferences", label: "Preferences", icon: "⚙️" },
        { id: "settings", label: "Advanced Settings", icon: "🔧" }
    ];

    if (!isLoggedIn) {
        return (
            <div className="profile-container">
                <div className="login-required">
                    <h2>Please log in to access your profile</h2>
                    <p>You need to be logged in to view and manage your profile settings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile Settings</h1>
                <p>Manage your account, security, and preferences</p>
            </div>

            <div className="settings-layout">
                <aside className="settings-sidebar">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className={`sidebar-item ${selectedContent === item.id ? "active" : ""}`}
                            onClick={() => setSelectedContent(item.id)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                        </div>
                    ))}
                </aside>

                <main className="settings-content">
                    <div className="content-header">
                        <h2>{menuItems.find(item => item.id === selectedContent)?.label}</h2>
                        <p>Manage your {menuItems.find(item => item.id === selectedContent)?.label.toLowerCase()}</p>
                    </div>
                    {contentMap[selectedContent]}
                </main>
            </div>
        </div>
    );
}

export default Profile;
