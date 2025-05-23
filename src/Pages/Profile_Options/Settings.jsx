import { useState } from "react";
import Account_Info from "./Account_Info";
import SecuritySettings from "./SecuritySettings";     // create these components
import PreferencesSettings from "./PreferencesSettings";

function SettingsPage() {
    const [activeTab, setActiveTab] = useState("account");

    const renderContent = () => {
        switch (activeTab) {
            case "account":
                return <Account_Info />;
            case "security":
                return <SecuritySettings />;
            case "preferences":
                return <PreferencesSettings />;
            default:
                return null;
        }
    };

    return (
        <div className="settings-layout">
            <aside className="settings-sidebar">
                <div
                    className={`sidebar-item ${activeTab === "account" ? "active" : ""}`}
                    onClick={() => setActiveTab("account")}
                >
                    Account Info
                </div>
                <div
                    className={`sidebar-item ${activeTab === "security" ? "active" : ""}`}
                    onClick={() => setActiveTab("security")}
                >
                    Security
                </div>
                <div
                    className={`sidebar-item ${activeTab === "preferences" ? "active" : ""}`}
                    onClick={() => setActiveTab("preferences")}
                >
                    Preferences
                </div>
            </aside>

            <main className="settings-content">
                {renderContent()}
            </main>
        </div>
    );
}

export default SettingsPage;
