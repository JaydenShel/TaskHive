import '../Style/s_profile.css'

function Profile(){
    const renderPreferences = () => {
        console.log("Settings")
    }

    const renderAccountInfo = () => {
        console.log("AccountInfo")
    }

    return(
        <div className={"profile-page"}>
            <div className={'selection-box'}>
                <div className={"option"} onClick={renderPreferences}>
                    <h1 className={"username"}>Settings</h1>
                </div>
                <div className={"option"} onClick={renderAccountInfo}>
                    <h1 className={"username"}>Account Info</h1>
                </div>
            </div>

        </div>
    )
}

export default Profile