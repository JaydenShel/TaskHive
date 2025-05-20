import '../Style/s_profile.css';
import { useState } from 'react';
import Settings from './Profile_Options/Settings.jsx';
import Account_Info from './Profile_Options/Account_Info.jsx';

function Profile() {
    const [selectedContent, setSelectedContent] = useState("account_info");

    const contentMap = {
        settings: <Settings />,
        account_info: <Account_Info />
    };

    return (
        <div className="settings-layout">
            <aside className="settings-sidebar">
                <div
                    className={`sidebar-item ${selectedContent === "settings" ? "active" : ""}`}
                    onClick={() => setSelectedContent("settings")}
                >
                    Settings
                </div>
                <div
                    className={`sidebar-item ${selectedContent === "account_info" ? "active" : ""}`}
                    onClick={() => setSelectedContent("account_info")}
                >
                    Account Info
                </div>
            </aside>

            <main className="settings-content">
                {contentMap[selectedContent]}
            </main>
        </div>
    );
}

export default Profile;
