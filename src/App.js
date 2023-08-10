
import { useEffect } from "react"
import Header from "./components/Header"
import Main from "./components/Main"
import { useState } from "react"
import { useReducer } from "react";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";


const initialState = {
  questions: [],
  // 'loading' , 'error' , 'ready' , 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,

}
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready'
      }

    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      }
    case 'start':
      return {
        ...state,
        status: 'active'
      }

    case 'newAnswer':
      const question = state.questions.at(state.index);
      console.log(typeof (action.payload))
      console.log(typeof (question.correctOption))
      console.log(state.points + question.points)
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points :
          state.points,

      }

    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }
    case 'finish':
      return {
        ...state, status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore
      }

    case 'restart':
      return {

        ...initialState,
        questions: state.questions,
        status: 'ready'
      }

    default:
      throw new Error("Action is unknown")
  }
}

export default function App() {


  const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(reducer, initialState)
  const numQuestions = questions.length

  const maxPossiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0)
  useEffect(function () {

    const getData = async () => {
      await fetch('http://localhost:9000/questions')
        .then(res => res.json())
        .then(data => {
          console.log(data)
          dispatch({ type: 'dataReceived', payload: data })
        }
        )
        .catch(err => dispatch({ type: 'dataFailed' }))
    }
    getData();

  }, [])


  return <div className="app" >

    <Header />


    <Main>
      {status === 'loading' && <Loader />}
      {status === 'error' && <Error />}
      {status === 'ready' && <StartScreen dispatch={dispatch} numQuestions={numQuestions} />}
      {status === 'active' &&
        <>
          <Progress index={index} numQuestion={numQuestions} points={points}
            maxPossiblePoints={maxPossiblePoints}
            answer={answer}
          />
          <Question dispatch={dispatch}
            question={questions[index]}
            answer={answer}
          />

          <NextButton dispatch={dispatch} answer={answer}
            numQuestions={numQuestions}
            index={index}
          />
        </>

      }

      {status === 'finished' && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints}
        highscore={highscore}
        dispatch={dispatch}
      />}

    </Main>

  </div>
}

// function Loader() {
//   return <div>
//     <p>Loading.........</p>
//   </div>
// }