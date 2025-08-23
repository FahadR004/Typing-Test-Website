const Counter = ({ remainingTime }: { remainingTime: number }) => {
     if (remainingTime === 0) {
            console.log('TIme finished')
  }

  return (
    <div className="timer">
      <div className="font-poppins-bold text-3xl">{remainingTime}</div>
      <div className="text-sm">seconds</div>
    </div>
  );
}

export default Counter;