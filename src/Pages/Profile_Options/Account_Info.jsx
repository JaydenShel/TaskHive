import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";

function Account_Info() {
    const navigate = useNavigate();
    const [hasImage, setHasImage] = useState(false)

    //Load in user image ect. upon render
    useEffect(() =>{
        loadImage().then(r => console.log("Image Loaded"));
    }, [])

    const handlePasswordReset = () => {
        navigate("/home/reset")
        console.log("User Chose to Reset Password")
    }

    const handleUserImage = () =>{
        //If user already has loaded image, prompt to change it
        console.log("User can change image.")
    }

    const handleNewUserImage = () =>{
        console.log("User has no image select one from device.")
    }

    const loadImage = async () =>{
         const image = await fetch('', )
    }

    return (
        <div>
            <div className={"profile-container"}>
                <div className={"profile-logo2"} onClick={handleNewUserImage}>
                    {hasImage && <button className={"submit-button"} onClick={handleUserImage}></button> }
                </div>
            </div>
            <div className={"username"}>
                <h2 className={"username"}>Username: {localStorage.getItem("username")}</h2>
                <h2 className={"username"}>Password: **********</h2>
                <div className={"submit-button"} onClick={handlePasswordReset}>Reset Password</div>
            </div>
            <div className={"option-box"}></div>
        </div>
    )
}

export default Account_Info