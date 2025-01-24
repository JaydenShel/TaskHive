import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Account_Info() {
    const navigate = useNavigate();

    const handlePasswordReset = () => {
        navigate("/home/reset")
        console.log("User Chose to Reset Password")
    }

    return (
        <div>
            <h1 className={"options-title"}></h1>
            <div className={"option-box"}>
                <h1>Username: {localStorage.getItem("username")}</h1>
                <h1>Password: **********</h1>
                <div className={"submit-button"} onClick={handlePasswordReset}>Reset Password</div>
            </div>
            <div className={"option-box"}></div>
        </div>
    )
}

export default Account_Info