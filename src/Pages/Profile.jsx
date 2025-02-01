import '../Style/s_profile.css'
import {useState} from "react";
import Settings from './Profile_Options/Settings.jsx'
import Account_Info from './Profile_Options/Account_Info.jsx'

function Profile(){
    const [selectedContent, setSelectedContent] = useState("");

    //Map with various different options to render
    const contentMap = {
        settings: <Settings/>,
        account_info: <Account_Info/>
    }

    const renderPreferences = () => {
        setSelectedContent("settings")
        console.log("Settings")
    }

    const renderAccountInfo = () => {
        setSelectedContent("account_info")
        console.log("AccountInfo")
    }

    return(
        <div className={"profile"}>
            <div className={"profile-page"}>
                <div className={'selection-box'}>
                    <div className={"option"} onClick={renderPreferences}>
                        <h1 className={"username"}>Settings</h1>
                    </div>
                    <div className={"option"} onClick={renderAccountInfo}>
                        <h1 className={"username"}>Account Info</h1>
                    </div>
                </div>
                {contentMap[selectedContent]}
            </div>
        </div>
    )
}

export default Profile