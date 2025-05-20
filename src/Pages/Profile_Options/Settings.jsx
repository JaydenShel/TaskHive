import Account_Info from "./Account_Info";

function SettingsPage() {
    return (
        <div className="settings-layout">
            <aside className="settings-sidebar">
                <div className="sidebar-item active">Account Info</div>
                <div className="sidebar-item">Security</div>
                <div className="sidebar-item">Preferences</div>
            </aside>

            <main className="settings-content">
                <Account_Info />
            </main>
        </div>
    );
}

export default SettingsPage;
