import { useState } from "react";
import SecuritySettings from "./SecuritySettings";
import PreferencesSettings from "./PreferencesSettings";

function SettingsPage() {
    const [activeTab, setActiveTab] = useState("security");

    const renderContent = () => {
        switch (activeTab) {
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
