import TextBox from '../Components/InputBox.jsx';
import '../Style/s_login.css';
import { Context } from '../states/LoginContext';
import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

function Reset() {
    const navigate = useNavigate();
    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [errorStatus, setErrorStatus] = useState(true)

    // Get setIsLoggedIn from context
    const [isLoggedIn, setIsLoggedIn] = useContext(Context);

    //Upon user pressing the submit button (user is logged in)
    const handleSubmit = async () => {
        //Determine is user is logged in, if not forgot password
        if(!isLoggedIn){
            console.log("User is not logged in (Forgot Password functionality in progress)")
        }

        //POST request to send old password and new password, reset password
        const response = await fetch('http://localhost:3000/login/', {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({currPassword, newPassword})
        })

        if(response.status >= 400){
            setError("Login failed");
        }
        else{
            //Retrieve response data and token, set token in session storage
            const data = await response.json();
            const message = data.message;
            console.log(message)

            setErrorStatus(false);
            setError("Password Reset");

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
                    label="Enter Current Password"
                    type="password"
                    required
                    value={currPassword}
                    onChange={setCurrPassword}
                />
                <TextBox
                    label="Enter New Password"
                    type="password"
                    required
                    value={newPassword}
                    onChange={setNewPassword}
                />
                <TextBox
                    label="Confirm New Password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />
                <button className="submit-button" onClick={handleSubmit}>
                    Sign In
                </button>

                <h3 className={errorStatus ? "warning" : "password-info"}>
                    {error}
                </h3>
            </div>
        </div>
    );
}

export default Reset;
