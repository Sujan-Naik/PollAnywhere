import { useState } from "react"


const MCQButton = (inputData) => {
    const {option, socket, lecturer} = inputData
    const [pressed, setPressed] = useState(false)

    const submitMCQAnswer = (option) => {
        socket.emit("submit-answer-MCQ", lecturer , option)
        setPressed(true)
        console.log("Option is ", option)
    }

    const unSubmitMCQ = (option) => {
        socket.emit("unsubmit-answer-MCQ", lecturer , option)
        setPressed(false)
        console.log("Option is ", option)
    }

    const handleMCQ = (option) => {
        !pressed ? submitMCQAnswer(option) : unSubmitMCQ(option)
    }

    return(
        <button id="MCQButton" key={option} className={pressed ? "pOption" : "unpOption"} onClick={() => handleMCQ(option)}>
            {option.includes("<code>") ? option[0]: option}</button>
    )
}

export default MCQButton