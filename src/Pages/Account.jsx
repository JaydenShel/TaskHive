import '../Style/s_login.css';
import TextBox from "../Components/InputBox.jsx";
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from "../config";

function Account() {
    //Use states for each user input
    const [selectedUsername, setUsername] = useState("");
    const [selectedPassword, setPassword] = useState("");
    const [selectedPassword_r, setPassword_r] = useState("");
    const [error, setError] = useState("");
    const [errorStatus, setErrorStatus] = useState(true)

    //Get useNavigate
    const navigate = useNavigate();

    //Client-side check to ensure passwords match
    const passwordConfirm = () => {
        return selectedPassword_r === selectedPassword;
    }

    const handleSubmit = async () =>{
        //If passwords don't match leave submit
        if(!passwordConfirm()){
            setError("Passwords Do Not Match")
            return
        }

        const response = await fetch(`${API_BASE_URL}/account/`,
            {
                method:"POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({selectedUsername, selectedPassword, selectedPassword_r}),
            })
        if(response.status > 400){
            setError("Account Creation Failed")
        }

        //Display success message
        setErrorStatus(false)
        setError("Account Successfully Created")

        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }
    return(
        <div className={"login-container"}>
            <div className={"form-container"}>
                <TextBox
                    label="Choose Username"
                    type="text"
                    required
                    value={selectedUsername}
                    onChange={setUsername}

                ></TextBox>
                <TextBox
                    label="Choose Password"
                    type="password"
                    required
                    value={selectedPassword}
                    onChange={setPassword}
                ></TextBox>
                <TextBox
                    label="Retype Password"
                    type="password"
                    required
                    value={selectedPassword_r}
                    onChange={setPassword_r}
                ></TextBox>
                <h3 className="password-info">
                    *Passwords must be 8-16 characters in length
                </h3>
                <button className={"submit-button"} onClick={handleSubmit}>Sign Up</button>
                <h3 className={errorStatus ? "warning" : "password-info"}>{error}</h3>
            </div>

        </div>
    )
}

export default Account;