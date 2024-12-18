import TextBox from '../Components/InputBox.jsx';
import '../Style/s_login.css'
import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (password.length < 8 || password.length > 16) {
            setError("Password must be between 8-16 characters.");
            setIsSuccess(false);
        } else {
            setError("Login successful!");
            setIsSuccess(true);
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <TextBox
                    label="Enter Username"
                    type="text"
                    required
                    value={username}
                    onChange={setUsername}
                />
                <TextBox
                    label="Enter Password"
                    type="password"
                    required
                    value={password}
                    onChange={setPassword}
                />
                <h3 className="password-info">
                    *Passwords must be at least 8-16 characters in length
                </h3>
                <button className="submit-button" onClick={handleSubmit}>
                    Sign In
                </button>
                <h3 className={isSuccess ? "success" : "warning"}>
                    {error}
                </h3>
            </div>
        </div>
    );
}

export default Login;
