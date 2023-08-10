function Progress({ index, numQuestion, points, maxPossiblePoints, answer }) {

    console.log(points)
    return (
        <header className="progress">
            <progress max={numQuestion} value={index + Number(answer !== null)}></progress>

            <p>Question <strong>{index + 1}</strong> / <strong>{numQuestion}</strong> </p>

            <p> <strong> {points} </strong> /  {maxPossiblePoints} </p>
        </header>
    )
}

export default Progress
