import {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { Map, setIn } from  "immutable"
import MCQButton from "./MCQButton"
import parse from 'html-react-parser'
import Modal from 'react-bootstrap/Modal'

const QuestionDisplay = (inputData) => {
    const {givenQuestion, isAdmin, socket, lecturer} = inputData
    const {question, options, answers, questionType, _id} = givenQuestion
    const navigate = useNavigate()

    const [isMCQ, setMCQ] = useState(options.length > 1)
    const [hasCode, setCode] = useState(questionType === 'CodeMCQ')
    const [showAnswer, setShowAnswer] = useState(false)
    const [textAnswer, setTextAnswer] = useState(null)

    let initialWh = new Map()
    const [answeredTextQuestions, setAnsweredQuestions] = useState(initialWh)

    const [showInput, setShowInput] = useState(false)
    const handleCloseInput = () => setShowInput(false)
    const handleShowInput = () => setShowInput(true)

    let initialSelectedMCQ
    if (isMCQ) {
        const map = new Map()
        const optionPressed = options.map(o => false)
        initialSelectedMCQ = map.set(givenQuestion._id, optionPressed)
    } else {
        initialSelectedMCQ = new Map()
    }

    const [selectedMCQ, setSelectedMCQ] = useState(initialSelectedMCQ)

    const handleSubmission = () => {
        setShowAnswer(!showAnswer)
    }

    const handleDisconnect = () => {
        socket.emit("host-disconnect", lecturer) 
        navigate(-1)
    }

    const submitAnswer = async e => {
        e.preventDefault()
        socket.emit("submit-answer-text", lecturer, textAnswer)

        setAnsweredQuestions((prevMap) => {
            const newMap = prevMap.set(_id, textAnswer)
            return newMap
        })
        setTextAnswer("")
    }

    useEffect(() => {
        let displayQuestionHandler = null
        displayQuestionHandler = newQuestion => {
            setMCQ(newQuestion.options.length > 1)
            setCode(newQuestion.questionType === 'CodeMCQ')
            if (isMCQ) {
                setSelectedMCQ(prevMCQ => {
                    if(!prevMCQ.has(newQuestion._id)) {
                        const optionPressed = newQuestion.options.map(o => false)
                        const newMCQ = prevMCQ.set(newQuestion._id, optionPressed)
                        return newMCQ
                    }
                    return prevMCQ
                })
            }
        }
        socket.addEventListener("display-question", displayQuestionHandler)
        return () => {
            if (displayQuestionHandler) {
                socket.removeEventListener("display-question", displayQuestionHandler)
            }
        }

    }, [])

    const submitMCQAnswer = (option, position) => {
        socket.emit("submit-answer-MCQ", lecturer , option)
        setSelectedMCQ(prevMCQ => {
            const newOptionPressed = prevMCQ.get(givenQuestion._id)
            newOptionPressed[position] = true
            const newMCQ = prevMCQ.set(givenQuestion._id, [...newOptionPressed])
            return newMCQ
        })
    }

    const unSubmitMCQ = (option, position) => {
        socket.emit("unsubmit-answer-MCQ", lecturer , option)
        setSelectedMCQ(prevMCQ => {
            const newOptionPressed = prevMCQ.get(givenQuestion._id)
            newOptionPressed[position] = false
            const newMCQ = prevMCQ.set(givenQuestion._id, [...newOptionPressed])
            return newMCQ
        })
    }

    const handleMCQ = (option, position) => {
        let pressed = false
        if (selectedMCQ.has(givenQuestion._id)) {
            pressed = selectedMCQ.get(givenQuestion._id)[position]
        }
        !pressed ? submitMCQAnswer(option, position) : unSubmitMCQ(option, position)
    }

    return (
        <div className="questionContainer">
            <h1 id="displayedQuestion">{question}</h1>
            <div className="options">
                {isMCQ && (!isAdmin) ?
                    options.map((option, i) => {
                        let pressed = false
                        if (selectedMCQ.has(givenQuestion._id)) {
                            pressed = selectedMCQ.get(givenQuestion._id)[i]
                        }
                        return <MCQButton option={option} position={i} socket={socket} lecturer={lecturer} pressed={pressed} handleMCQ={handleMCQ}/>
                    })
                    
                    :
                    <div className="answerInput">
                         {!isAdmin ?
                            <div className="row">
                                <div className="col">
                                    <div className="answerOptions">
                                        <form onSubmit={submitAnswer}>
                                            <input id="answerBox" name="answerArea" type="text" value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)} disabled={answeredTextQuestions.has(_id)}/>
                                            <br/>
                                            {!(answeredTextQuestions.has(_id)) ?
                                                <button id="answerSubmit" type="submit">Submit</button>
                                            :
                                            null}
                                        </form>
                                        {answeredTextQuestions.has(_id) ?
                                        <div>
                                            <button id="answerSubmit" onClick={handleShowInput}>Show</button>
                                            <Modal show={showInput} onHide={handleCloseInput}>
                                                <Modal.Body>
                                                    <h3>Your Answer</h3>
                                                    <div className="closeIcon">
                                                        <span className="material-symbols-outlined" onClick={handleCloseInput}>Close</span>
                                                    </div>
                                                    <div className="card">
                                                        <p id = "studentAnswer">{answeredTextQuestions.get(_id)}</p>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                        : null}
                                    </div>
                                </div>
                            </div>
                            :
                            null}
                    </div>
                }
            </div>

            {isAdmin ?
                <div id="questionDisplayButtons">
                    {showAnswer ? (
                        <div>
                            <button className="showAnswer" onClick={handleSubmission}>Show Options</button>
                            <button id="disconnectButton" onClick={handleDisconnect}>Disconnect</button>
                        </div>
                    ) : (
                        <div>
                            <button className="showAnswer" onClick={handleSubmission}>Show Answers</button>
                            <button id="disconnectButton" onClick={handleDisconnect}>Disconnect</button>
                        </div>
                    )}
                    <div className="card" id="answerBox">
                        {showAnswer ? (
                            <div id="answers">
                                {answers.map((answer) => (
                                    <button key={answer} className="answer">{parse(answer)}</button>
                                ))}
                            </div>
                        ) : (
                            <div id="options">
                                {options.map((option) => (
                                    <button className="answer">{parse(option)}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            : null}

        </div>
    )
}

export default QuestionDisplay