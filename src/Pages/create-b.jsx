import { useState } from "react";
import TextBox from "../Components/InputBox.jsx";

function CreateB() {
    //User assigned board values
    const [boardName, setBoardName] = useState('');
    const [err, setErr] = useState('');
    const [errStatus, setErrStatus] = useState(false);
    const [displayStatus, setDisplayStatus] = useState(false);

    const handleBoardSubmit = () => {
        try{
            const response = async () => {
                await fetch('http://localhost:8080/createBoards', {
                    method: "POST",
                    headers: {
                        "content-type": 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({boardName})
                })
            }

            if(response >= 300){
                console.log("Failed to create board")

                //Set response eof the error
                setErrStatus(true)

            }
        }
        catch(err){
            setErrStatus(true)
            setErr(err)
        }
    }

    return(
        <div>
            <div className={"selection-grid"}>
                <TextBox
                    label="Enter Board Name"
                    type="text"
                    required
                    value={boardName}
                    onChange={setBoardName}
                />
                <button className={"submit-button"} onClick={handleBoardSubmit}>Create Board</button>
                {errStatus && <h1 className={"warning"}>{err}</h1>}
            </div>
            <div className={"display-grid"}>

            </div>
        </div>
    )

}

export default CreateB