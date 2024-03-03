import EnterNameForm from "../components/EnterNameForm"

const UserPage = (inputData) =>{
    const {socket} = inputData

    return(
        <div className="user-page">    
            <EnterNameForm socket={socket}/>
        </div>
    )
}

export default UserPage