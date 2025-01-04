import '../Style/s_login.css';
import TextBox from "../Components/InputBox.jsx";
import {useState} from "react";

function Account() {
    const [selectedUsername, setUsername] = useState("");
    const [selectedPassword, setPassword] = useState("");
    const [selectedPassword_r, setPassword_r] = useState("");

    return(
        <div className={"login-container"}>
            <div className={"form-container"}>
                <TextBox
                    label="Enter Username"
                    type="text"
                    required
                    value={selectedUsername}
                    onChange={setUsername}

                ></TextBox>
                <TextBox
                    label="Enter Password"
                    type="text"
                    required
                    value={selectedPassword}
                    onChange={setPassword}
                ></TextBox>
                <TextBox
                    label="Retype Password"
                    type="text"
                    required
                    value={selectedPassword_r}
                    onChange={setPassword_r}
                ></TextBox>
                <h3 className="password-info">
                    *Passwords must be at least 8-16 characters in length
                </h3>
                <button className={"submit-button"}>Sign Up</button>
            </div>

        </div>
    )
}

export default Account;