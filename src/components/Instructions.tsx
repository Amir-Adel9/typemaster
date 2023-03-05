interface InstructionsProps {
  difficulty: {
    timeLimit: number;
    wordCount: number;
  };
  onChangeDifficulty: React.ChangeEventHandler<HTMLSelectElement>;
  gameStarted: boolean;
  onGameStart: () => void;
  timeLeft: number;
  bodyRef: React.RefObject<HTMLDivElement>;
  startButtonRef: React.RefObject<HTMLButtonElement>;
}

const Instructions = (props: InstructionsProps) => {
  return (
    <div
      className='relative flex h-[70%] w-[70%] flex-col items-center justify-evenly rounded-2xl bg-[#111] duration-700'
      ref={props.bodyRef}
    >
      <div className='mt-8 text-center font-mono text-xl text-primary'>
        Instructions
      </div>
      <div className='my-5 text-center font-poppins text-white'>
        Welcome to Type Master, You will be shown a series of random words and
        <br />
        will have to type the prompted word within a certain time. The word
        count
        <br /> and the time limit to type each word is determined by the
        game&apos;s difficulty
      </div>
      <div>
        <div className='text-center font-poppins text-white'>
          You are now playing on the{' '}
          <span className='text-primary'>
            <select
              className='mx-1 border-none bg-primary font-poppins font-bold text-black outline-none'
              onChange={props.onChangeDifficulty}
            >
              <option
                className='hover:text-[#111]'
                selected={props.difficulty?.wordCount === 15 ? true : false}
                value='0'
              >
                Easy
              </option>
              <option
                selected={props.difficulty?.wordCount === 25 ? true : false}
                value='1'
              >
                Normal
              </option>
              <option
                selected={props.difficulty?.wordCount === 30 ? true : false}
                value='2'
              >
                Hard
              </option>
            </select>
          </span>{' '}
          difficulity <br /> and you have{' '}
          <span className='text-primary '>
            {props.gameStarted
              ? Math.trunc(props.timeLeft / 10)
              : Math.trunc((props.difficulty?.timeLimit as number) / 10)}
          </span>{' '}
          seconds to type the each word
          <span className='mt-2 block'>
            Words to type:{' '}
            <span className='text-primary '>{props.difficulty?.wordCount}</span>
          </span>
        </div>
      </div>
      <button
        className='mt-5 block w-[50%] rounded-md bg-primary p-5 font-mono text-2xl font-bold duration-300 hover:scale-[1.04] hover:bg-hovered'
        onClick={props.onGameStart}
        ref={props.startButtonRef}
      >
        Start Playing
      </button>
    </div>
  );
};

export default Instructions;
