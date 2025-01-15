import TextBox from '../Components/InputBox.jsx';
import '../Style/s_login.css';
import { Context } from '../states/LoginContext';
import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Get setIsLoggedIn from context
    const [, setIsLoggedIn] = useContext(Context);

    //Upon user pressing the submit button
    const handleSubmit = async () => {
        //POST request to send username and password to verify credentials
        const response = await fetch('http://localhost:3000/login/', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({username, password})
        })

        if(response.status >= 400){
            setError("Login failed");
        }
        else{
            //Retrieve response data and token, set token in session storage
            const data = await response.json();
            const message = data.message;
            console.log(message)

            setError("Login Successful");
            setIsLoggedIn(true);

            //Retrieve username and store in localStorage
            const username = data.username;
            localStorage.setItem('username', username);

            //Navigate back to home page
            setTimeout( () => {
                navigate('/');
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
                <button className="submit-button" onClick={handleSubmit}>
                    Sign In
                </button>
                <h3 className={"password-info"}>
                    {error}
                </h3>
            </div>
        </div>
    );
}

export default Login;
