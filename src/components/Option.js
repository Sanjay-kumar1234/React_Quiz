function Option({ question, dispatch, answer }) {
    const hasAnswer = answer !== null

    return (
        <div className="options" >
            {question.options.map((option, index) => {
                return (
                    <button key={option} className={`btn btn-option  ${index === answer ? "answer" : ""} ${hasAnswer ? index === question.correctOption ? "correct" : "wrong" : ""} `}
                        onClick={() => dispatch({ type: 'newAnswer', payload: index })}
                        disabled={answer !== null}
                    >{option} </button>
                )
            })}
        </div>
    )
}

export default Option
