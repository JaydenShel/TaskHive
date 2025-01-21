import '../Style/s_profile.css'

function Profile(){
    const handleSettings = () => {
        console.log("Settings")
    }

    return(
        <div>

            <div className={'selection-box'}>
                <div className={"option"} onClick={handleSettings}>
                    <h1 className={"username"}>Settings</h1>
                </div>
            </div>

        </div>
    )
}

export default Profile