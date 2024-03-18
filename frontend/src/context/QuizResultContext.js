import {createContext, useReducer} from "react";

export const QuizzesContext = createContext()

/**
 * Performs changes to states based on actions
 * @param state the previous state before the change is made
 * @param action corresponds to the action performed on a quiz
 */
export const quizzesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_QUIZ_RESULTS':
            return {
                quizzes: action.payload
            }
        case 'SET_QUIZ_RESULT':
            return{
                quiz: action.payload
            }
        case 'CREATE_QUIZ_RESULT':
            return {
                quizzes: [action.payload, ...state.quizzes]
            }
        case 'DELETE_QUIZ_RESULT':
            return {
                quizzes: state.quizzes.filter((q) => q._id !== action.payload._id)
            }
        default:
            return state
    }
}

/**
 * Wraps around app
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const QuizzesContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(quizzesReducer, {
        quizzes: null
    })


    return (
        <QuizzesContext.Provider value={{...state, dispatch}}>
            {children}
        </QuizzesContext.Provider>
    )
}