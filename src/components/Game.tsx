import DifficultyDropdown from './dropdowns/difficultyDropdown';
import ThemeDropdown from './dropdowns/themeDropdown';
import DifficultyIcon from './svgs/difficultyIcon';
import InstructionsIcon from './svgs/instructionsIcon';
import ThemeIcon from './svgs/themeIcon';

import Image from 'next/image';

interface GameProps {
  words: string[];
  difficulty: {
    timeLimit: number;
    wordCount: number;
  };
  splittedCurrentWord: string[];
  difficultyHandler: React.Dispatch<
    React.SetStateAction<{
      timeLimit: number;
      wordCount: number;
    }>
  >;
  currentUserData: {
    displayName: string;
    id: string;
    imageURL: string;
    level: number;
    levelExp: number;
    timesPlayed: number;
    wins: number;
  };
  levelExp: number;
  gameStarted: boolean;
  isGameOver: boolean;
  isLoading: boolean;
  isPlaying: boolean;
  gameResult: string;
  timeLeft: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  score: number;
  isInstructionsMode: boolean;
  isShowingDropDown: boolean;
  themeIsShowing: boolean;
  gameStartHandler: () => void;
  getCharClass: (idx: number, letter: string) => string;
  isInstructionsModeHandler: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingDropdownHandler: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingThemeHandler: React.Dispatch<React.SetStateAction<boolean>>;
  currentThemeHandler: React.Dispatch<React.SetStateAction<string>>;
  gameBodyRef: React.RefObject<HTMLDivElement>;
  startButtonRef: React.RefObject<HTMLButtonElement>;
  wordRef: React.RefObject<HTMLDivElement>;
}

const Game = (props: GameProps) => {
  return (
    <div
      className='relative flex h-[70%] w-[70%] flex-col items-center justify-center rounded-2xl bg-[#111] duration-700'
      ref={props.gameBodyRef}
    >
      <div className='absolute top-3 left-3 flex w-24 justify-evenly'>
        <InstructionsIcon
          isInstructionsMode={props.isInstructionsMode}
          instructionsModeHandler={props.isInstructionsModeHandler}
          isGameStarted={props.gameStarted}
        />
        <DifficultyIcon
          difficultyIsShowing={props.isShowingDropDown}
          difficultyIsShowingHandler={props.isShowingDropdownHandler}
          isGameStarted={props.gameStarted}
        />
        <DifficultyDropdown
          isActive={props.isShowingDropDown}
          difficultyHandler={props.difficultyHandler!}
        />
        <ThemeIcon
          themeIsShowing={props.themeIsShowing}
          themeIsShowingHandler={props.isShowingThemeHandler}
        />
        <ThemeDropdown
          isActive={props.themeIsShowing}
          currentThemeHandler={props.currentThemeHandler}
        />
      </div>
      <b className='absolute top-20 text-3xl text-white '>{props.gameResult}</b>
      <b
        className={`select-none text-center font-mono font-semibold duration-200 ${
          props.isPlaying ? 'text-8xl' : 'absolute top-[25%] text-5xl'
        }`}
        ref={props.wordRef}
      >
        {props.splittedCurrentWord?.map((letter, idx) => (
          <span key={idx} className={props.getCharClass(idx, letter)}>
            {letter}
          </span>
        ))}
      </b>
      <div
        className={`mt-5 flex w-full flex-wrap justify-center rounded-lg  p-4 text-center font-poppins text-base font-medium ${
          props.isGameOver ? 'hidden' : ''
        }`}
      >
        {props.isLoading ? (
          'Loading...'
        ) : !props.gameStarted ? (
          <b className='hidden'></b>
        ) : (
          props.words.map((word: string) => {
            return (
              <b key={word} className=' ] m-1 rounded-md bg-primary p-[10px]'>
                {word}
              </b>
            );
          })
        )}
      </div>
      <div
        className={`flex w-full flex-col items-center justify-center text-white ${
          !props.isGameOver ? 'hidden' : ''
        }`}
      >
        <span className='h-12 w-12 overflow-hidden rounded-full border-2 border-primary'>
          <Image
            src={
              props.currentUserData?.imageURL
                ? props.currentUserData?.imageURL
                : '/user.svg'
            }
            alt=''
            width={100}
            height={100}
            className='h-full w-full duration-300 ease-in-out'
          />
        </span>
        <div className='my-5 flex flex-col items-center'>
          <b>{props.currentUserData?.displayName}</b>
          <b>Times Played: {props.currentUserData.timesPlayed}</b>
          <b>Wins: {props.currentUserData.wins}</b>
        </div>
        <b className='mb-1'>Lvl. {props.currentUserData.level}</b>
        <div className='relative h-3 w-[25%] rounded-full bg-gray-200 text-center'>
          <span className='absolute left-[45%] z-20 text-xs font-bold leading-none text-black'>
            {props.levelExp?.toFixed(1)}%
          </span>
          <div
            className='absolute left-0 z-10 h-3 rounded-full bg-primary duration-1000'
            style={{ width: `${props.levelExp}%` }}
          ></div>
        </div>
      </div>
      <button
        className='absolute bottom-20 mt-5 hidden w-[50%] rounded-md bg-primary  p-5 font-mono text-2xl font-bold duration-300 hover:scale-[1.04] hover:bg-hovered'
        onClick={props.gameStartHandler}
        ref={props.startButtonRef}
      >
        Start Playing
      </button>
      <div className='absolute bottom-0 flex w-full justify-between rounded-lg p-4 text-center text-white '>
        <b>
          Time Left:{' '}
          <span className='text-primary'>
            {props.gameStarted
              ? Math.trunc(props.timeLeft / 10)
              : Math.trunc((props.difficulty?.timeLimit as number) / 10)}
          </span>{' '}
          Seconds
        </b>

        <b>
          Correct: <span className='text-primary'>{props.correct}</span>
        </b>
        <b>
          Accuracy:{' '}
          <span className='text-primary'>{props.accuracy?.toFixed(1)}%</span>
        </b>
        <b>
          Incorrect: <span className='text-primary'>{props.incorrect}</span>
        </b>
        <b>
          Score: <span className='text-primary '>{props.score}</span> from{' '}
          <span className='text-primary '>{props.difficulty?.wordCount}</span>
        </b>
      </div>
    </div>
  );
};

export default Game;
