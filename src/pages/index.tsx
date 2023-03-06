/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';

import { trpc } from '../utils/trpc';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import router from 'next/router';

import Sidebar from '../components/sidebar/sidebar';
import MenuIcon from '../components/svgs/menuIcon';

import { useInterval } from '../utils/useInterval';

import { difficulties } from '../constants/difficulties';
import { themes } from '../constants/themes';

import Instructions from '../components/Instructions';
import Game from '../components/Game';

const Home: NextPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');

  const [difficulty, setDifficulty] = useState(difficulties[0]!);

  const [words, setWords] = useState(['']);
  const [currentWord, setCurrentWord] = useState('');
  const [splittedCurrentWord, setSplittedCurrentWord] = useState(['']);

  const [timeLeft, setTimeLeft] = useState(5);
  const [accuracy, setAccuracy] = useState(0);
  const [gameExp, setGameExp] = useState(0);
  const [levelExp, setLevelExp] = useState(0);
  const [gameResult, setGameResult] = useState('');
  const [score, setScore] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [incorrect, setIncorrect] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [charsTyped, setCharsTyped] = useState(0);

  const [isShowing, setIsShowing] = useState(false);

  const [isShowingDropDown, setIsShowingDropDown] = useState(false);
  const [themeIsShowing, setThemeIsShowing] = useState(false);
  const [isInstructionsMode, setIsInstructionsMode] = useState(true);

  const bodyRef = useRef<HTMLDivElement>(null);
  const gameBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const wordRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const headerTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedDisplayName = localStorage.getItem('displayName') as string;
    const storedTheme = localStorage.getItem('selectedTheme') as string;

    const isRegistered = storedDisplayName ? true : false;
    if (!isRegistered) {
      router.push('/register');
      return;
    } else {
      setDisplayName(
        storedDisplayName.charAt(0).toUpperCase() + storedDisplayName.slice(1)
      );
      setLevelExp(currentUserData?.levelExp as number);
      if (!storedTheme) {
        setSelectedTheme(themes[0] as string);
      } else {
        setSelectedTheme(storedTheme);
      }
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [difficulty]);

  useEffect(() => {
    setIsShowing(false);
    if (selectedTheme) {
      localStorage.setItem('selectedTheme', selectedTheme);
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (correct + incorrect === 0) {
      setAccuracy(0);
    }
    setAccuracy((correct / (correct + incorrect)) * 100);
  }, [correct, incorrect]);

  useEffect(() => {
    setGameExp((score / difficulty.wordCount) * 10);
  }, [score]);

  useEffect(() => {
    if (gameResult === 'You Lost') {
      setLevelExp((prevState) => prevState + gameExp);
    }
    if (gameResult === 'You Won!') {
      setLevelExp((prevState) => prevState + 10);
    }
  }, [gameResult]);

  useEffect(() => {
    if (levelExp) {
      setLevelExp(levelExp);
      increaseLevelExpMutation.mutate({
        id: currentUserData?.id as string,
        levelExp: levelExp,
      });
    }
    if (levelExp >= 100) {
      increaseLevelMutation.mutate(currentUserData?.id as string);
      setLevelExp(0);
      increaseLevelExpMutation.mutate({
        id: currentUserData?.id as string,
        levelExp: levelExp,
      });
    }
  }, [levelExp]);

  useEffect(() => {
    if (isShowing) {
      bodyRef.current?.classList.add('translate-x-[15%]');
      gameBodyRef.current?.classList.add('translate-x-[15%]');
    } else {
      bodyRef.current?.classList.remove('translate-x-[15%]');
      gameBodyRef.current?.classList.remove('translate-x-[15%]');
      headerTitleRef.current?.classList.remove('translate-x-[170%]');
    }
  }, [isShowing]);

  const { isLoading, refetch } = useQuery(
    ['randomWords'],
    () =>
      fetch(
        `https://random-word-api.herokuapp.com/word?number=${difficulty?.wordCount}`
      ).then((res) => res.json()),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setWords(data);
      },
    }
  );

  const ctx = trpc.useContext();

  const allUsersData = trpc.user.getAllUsersData.useQuery();

  const userData = allUsersData.data?.map((user) => {
    return {
      id: user.id,
      displayName: user.displayName,
      timesPlayed: user.timesPlayed,
      imageURL: user.imageURL,
      wins: user.wins,
      level: user.level,
      levelExp: user.levelExp,
    };
  });

  const currentUserData = allUsersData.data?.find((user) => {
    if (user.displayName === displayName) {
      return user;
    }
  });

  const increaseTimesPlayedMutation = trpc.user.increaseTimesPlayed.useMutation(
    { onSuccess: () => ctx.user.invalidate() }
  );
  const increaseWinsMutation = trpc.user.increaseWins.useMutation({
    onSuccess: () => ctx.user.invalidate(),
  });
  const increaseLevelMutation = trpc.user.increaseLevel.useMutation({
    onSuccess: () => ctx.user.invalidate(),
  });
  const increaseLevelExpMutation = trpc.user.increaseLevelExp.useMutation({
    onSuccess: () => ctx.user.invalidate(),
  });

  const currentWordHandler = () => {
    const randomWord = words[
      Math.floor(Math.random() * words.length)
    ] as string;
    const splitedWord = randomWord?.split('');
    setCurrentWord(randomWord);
    setSplittedCurrentWord(splitedWord);
    const wordIndex = words.indexOf(randomWord);
    words.splice(wordIndex, 1);
    return randomWord;
  };

  const changeDifficultyHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDifficulty(difficulties[event.target.value as unknown as number]!);
  };

  const getLetterColor = (idx: number, letter: string) => {
    const currentInput = inputRef.current?.value;
    const currentCharIdx = currentInput?.length;

    if (idx == currentCharIdx) {
      return isPlaying
        ? 'text-primary animate-pulse underline decoration-underline '
        : 'text-primary';
    }
    if (inputRef?.current?.value[idx] == null) {
      return 'text-primary';
    }
    if (inputRef?.current?.value[idx]?.toLowerCase() === letter.toLowerCase()) {
      return 'text-correct';
    } else {
      return 'text-wrong';
    }
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length < charsTyped) {
      return;
    }
    setCharsTyped(charsTyped + 1);
    if (
      event.currentTarget.value.at(-1) ===
      splittedCurrentWord[event.currentTarget.value.length - 1]
    ) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }

    if (event.currentTarget.value === currentWord) {
      inputRef.current.value = '';
      setScore((prevScore) => prevScore + 1);
      setCharsTyped(0);
      if (words.length === 0) {
        increaseWinsMutation.mutate(currentUserData?.id as string);
        setIsGameOver(true);
        setIsPlaying(false);
        setGameStarted(false);
        setGameResult('You Won!');
        refetch();
        inputRef.current.value = '';
        startButtonRef.current?.classList.remove('hidden');
      }
      currentWordHandler();
      setTimeLeft(difficulty?.timeLimit as number);
    }
  };

  const gameStartHandler = () => {
    setCharsTyped(0);
    setAccuracy(0);
    setCorrect(0);
    setIncorrect(0);
    setScore(0);
    setIsGameOver(false);
    setGameStarted(true);
    setIsPlaying(true);
    setIsInstructionsMode(false);
    setIsShowing(false);
    startButtonRef.current?.classList.add('hidden');
    inputRef.current.value = '';
    increaseTimesPlayedMutation.mutate(currentUserData?.id as string);
    currentWordHandler();
    setTimeLeft(difficulty?.timeLimit as number);
    setGameResult('');
  };

  useInterval(
    () => {
      if (!gameStarted) {
        return;
      }
      inputRef.current.focus();
      setTimeLeft(timeLeft - 1);

      if (timeLeft === 1) {
        setIsGameOver(true);
        setIsPlaying(false);
        setGameStarted(false);
        setGameResult('You Lost');
        refetch();
        startButtonRef.current?.classList.remove('hidden');
      }
    },
    isPlaying ? 100 : null
  );

  return (
    <>
      <Head>
        <title>Type Master</title>
        <meta name='description' content='Type Master by Amir Adel' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Sidebar
        isShowing={isShowing}
        isShowingHandler={setIsShowing}
        userData={userData}
        currentUserData={currentUserData}
        theme={selectedTheme}
        levelExp={levelExp}
      />
      <div
        className={
          'item-center flex h-screen w-full flex-col overflow-x-auto overflow-y-auto bg-[#222] duration-500 ease-in-out '
        }
        onClick={() => {
          if (isShowingDropDown) {
            setIsShowingDropDown(false);
          }
          if (themeIsShowing) {
            setThemeIsShowing(false);
          }
        }}
      >
        <header
          className={`fixed theme-${selectedTheme} flex h-[8%] w-screen items-center justify-center bg-[#111] font-mono text-lg font-bold text-primary`}
        >
          <button>
            <MenuIcon
              sidebarIsShowing={isShowing}
              sidebarIsShowingHandler={setIsShowing}
            />
          </button>
          <span className='duration-700' ref={headerTitleRef}>
            Type Master
          </span>
        </header>
        <input
          type='text'
          ref={inputRef}
          className='disabled w-1/2 cursor-default opacity-0'
          onChange={handleInput}
          maxLength={currentWord?.length}
          disabled={!gameStarted ? true : false}
        />
        <main
          className={`flex h-full items-center justify-center theme-${selectedTheme}`}
        >
          {isInstructionsMode ? (
            <Instructions
              difficulty={difficulty!}
              onChangeDifficulty={changeDifficultyHandler}
              gameStarted={gameStarted}
              onGameStart={gameStartHandler}
              timeLeft={timeLeft}
              bodyRef={bodyRef}
              startButtonRef={startButtonRef}
            />
          ) : (
            <Game
              accuracy={accuracy}
              correct={correct}
              currentThemeHandler={setSelectedTheme}
              difficulty={difficulty!}
              difficultyHandler={setDifficulty}
              gameBodyRef={gameBodyRef}
              gameResult={gameResult}
              gameStartHandler={gameStartHandler}
              gameStarted={gameStarted}
              getCharClass={getLetterColor}
              incorrect={incorrect}
              isInstructionsMode={isInstructionsMode}
              isInstructionsModeHandler={setIsInstructionsMode}
              isLoading={isLoading}
              isPlaying={isPlaying}
              isGameOver={isGameOver}
              isShowingDropDown={isShowingDropDown}
              isShowingDropdownHandler={setIsShowingDropDown}
              isShowingThemeHandler={setThemeIsShowing}
              score={score}
              splittedCurrentWord={splittedCurrentWord}
              startButtonRef={startButtonRef}
              themeIsShowing={themeIsShowing}
              timeLeft={timeLeft}
              wordRef={wordRef}
              currentUserData={currentUserData!}
              levelExp={levelExp}
              words={words}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
