import TextBox from '../Components/InputBox.jsx';
import { useState } from "react";

function login(){
    const [username, setUsername] = useState("");

    return(
        <div>
            <div>
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
                <h3>*Passwords must be atleast 8-16 characters in length</h3>
                <button onClick={handleSubmit}>Sign In</button>
                <h3 className={isSuccess ? "success" : "warning"}>{error}</h3>
            </div>
        </div>
    )
}

export default login