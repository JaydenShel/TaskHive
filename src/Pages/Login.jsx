import TextBox from '../Components/InputBox.jsx';
import '../Style/s_login.css'
import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    //Upon user pressing the submit button
    const handleSubmit = async () => {
        //POST request to send username and password to verify credentials
        const response = await fetch('http://localhost:3000/login/', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({username, password})
        })

        if(response.status >= 400){
            setError("Login failed");
        }
        else{
            //Retrieve response data and token, set token in session storage
            const data = await response.json();
            const token = data.token;
            sessionStorage.setItem('token', token);

            setError("Login Succesful");


            //Navigate back to home page
            setTimeout( () => {
                window.location.href = "/";
            }, 1000);
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
                <h3>
                    {error}
                </h3>
            </div>
        </div>
    );
}

export default Login;
