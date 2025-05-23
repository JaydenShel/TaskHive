import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../../config";

function SecuritySettings() {
    const navigate = useNavigate();
    const [err, setErr] = useState("");

    const handlePasswordReset = async () => {
        const res = await fetch(`${API_BASE_URL}/auth`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (res.ok) {
            navigate("/reset");
        } else {
            setErr("Not authenticated.");
        }
    };

    const toggleTwoFactor = () => {
        // You can integrate 2FA logic here later
        alert("2FA toggle clicked (functionality pending)");
    };

    return (
        <div className="security-settings-container">
            <h2 className="section-heading">Security Settings</h2>

            <div className="security-option-group">
                <p className={"account-text"}><strong>Password:</strong> ********</p>
                <button className="btn blue" onClick={handlePasswordReset}>
                    Reset Password
                </button>
            </div>

            <div className="security-option-group">
                <p className={"account-text"}><strong>Two-Factor Authentication:</strong></p>
                <button className="btn purple" onClick={toggleTwoFactor}>
                    Toggle 2FA
                </button>
            </div>

            {err && <div className="error-box">{err}</div>}
        </div>
    );
}

export default SecuritySettings;
