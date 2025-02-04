import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";

function Account_Info() {
    const navigate = useNavigate();
    const [hasImage, setHasImage] = useState(false);
    const [err, setErr] = useState("");

    //Load in user image ect. upon render
    useEffect(() =>{
        loadImage().then(r => console.log("Image Loaded"));
    }, [])

    const handlePasswordReset = () => {
        // Authenticate, then direct to reset password page, child of login page
        try{
            const response = async () => {
                await fetch('http://localhost:3000/auth/', {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                    },
                    credentials: "include",
                })
            }

            if(response.status > 400){
                console.log("Failed to authenticate user.")
            }
            else{
                navigate("/reset")
            }
        }
        catch(error){
            setErr(error)
        }

        console.log("User Chose to Reset Password")
    }

    const handleUserImage = () =>{
        //If user already has loaded image, prompt to change it
        console.log("User can change image.")
    }

    const loadImage = async () =>{
         const response = await fetch('http://localhost:3000/load-image/', {
             headers: {
                 "content-type": "application/json",
             },
             credentials: "include"
         })

         if(response.status >= 400){
             setHasImage(false)
             console.log("No user profile image.")
         }


    }

    const uploadImage = async () => {
        const response = await fetch('http://localhost:3000/upload-image/', {
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",

        })

        if(response.status >= 400){
            setErr("Failed to upload image.")
            console.log("Failed to upload image.")
        }
    }

    return (
        <div>
            <div className={"profile-container"}>
                <div className={"profile-logo2"}>
                    {hasImage && <button className={"submit-button"} onClick={handleUserImage}></button> }
                    {!hasImage && <button className={"profile-upload-button"} onClick={uploadImage}>Upload Image</button>}
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