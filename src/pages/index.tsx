/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';

import { trpc } from '../utils/trpc';
import type { FormEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import router from 'next/router';

import Sidebar from '../components/sidebar/sidebar';
import MenuIcon from '../components/svgs/menuIcon';
import InstructionsIcon from '../components/svgs/instructionsIcon';
import DifficultyIcon from '../components/svgs/difficultyIcon';
import DifficultyDropdown from '../components/dropdowns/difficultyDropdown';
import ThemeIcon from '../components/svgs/themeIcon';
import ThemeDropdown from '../components/dropdowns/themeDropdown';

import { useInterval } from '../utils/useInterval';
import { difficulties } from '../constants/difficulties';
import { themes } from '../constants/themes';

const Home: NextPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');

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
      if (!storedTheme) {
        setSelectedTheme(themes[0] as string);
      } else {
        setSelectedTheme(storedTheme);
      }
    }
  }, []);

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

  const registeredDisplayNames = trpc.user.getAllDisplayNames.useQuery();
  const allUsersData = trpc.user.getAllUsersData.useQuery();
  const currentUserData = allUsersData.data?.find((user) => {
    if (user.displayName === displayName) {
      return user.id;
    }
  });

  const increaseTimesPlayedMutation = trpc.user.increaseTimesPlayed.useMutation(
    { onSuccess: () => ctx.user.invalidate() }
  );
  const increaseWinsMutation = trpc.user.increaseWins.useMutation({
    onSuccess: () => ctx.user.invalidate(),
  });
  const userData = allUsersData.data?.map((user) => {
    return {
      id: user.id,
      displayName: user.displayName,
      timesPlayed: user.timesPlayed,
      wins: user.wins,
    };
  });

  const [difficulty, setDifficulty] = useState(difficulties[0]);

  const [words, setWords] = useState(['']);
  const [currentWord, setCurrentWord] = useState('');
  const [splittedCurrentWord, setSplittedCurrentWord] = useState(['']);

  const [timeLeft, setTimeLeft] = useState(50);
  const [gameResult, setGameResult] = useState('');
  const [score, setScore] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const wordRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const headerTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refetch();
  }, [difficulty]);

  useEffect(() => {
    setIsShowing(false);
    if (selectedTheme) {
      localStorage.setItem('selectedTheme', selectedTheme);
    }
  }, [selectedTheme]);

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
    setDifficulty(difficulties[event.target.value as unknown as number]);
  };

  const getLetterColor = (idx: number, letter: string) => {
    const currentInput = inputRef.current?.value;
    const currentCharIdx = currentInput?.length;

    if (idx == currentCharIdx) {
      return isPlaying
        ? 'text-primary animate-pulse underline decoration-underline'
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
    if (event.currentTarget.value === currentWord) {
      inputRef.current.value = '';
      setScore((prevScore) => prevScore + 1);
      if (words.length === 0) {
        increaseWinsMutation.mutate(currentUserData?.id as string);
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
    setIsInstructionsMode(false);
    startButtonRef.current?.classList.add('hidden');
    inputRef.current.value = '';
    increaseTimesPlayedMutation.mutate(currentUserData?.id as string);
    setScore(0);
    setGameStarted(true);
    setIsPlaying(true);
    currentWordHandler();
    setTimeLeft(difficulty?.timeLimit as number);
    setGameResult('');
  };

  useInterval(
    () => {
      if (!gameStarted) {
        return;
      }
      setTimeLeft((timeLeft) => timeLeft - 1);

      inputRef.current.focus();

      if (timeLeft === 1) {
        setIsPlaying(false);
        setGameStarted(false);
        setGameResult('You Lost');
        refetch();
        startButtonRef.current?.classList.remove('hidden');
      }
    },
    isPlaying ? 100 : null
  );

  const [isShowing, setIsShowing] = useState(false);

  const [isShowingDropDown, setIsShowingDropDown] = useState(false);
  const [themeIsShowing, setThemeIsShowing] = useState(false);
  const [isInstructionsMode, setIsInstructionsMode] = useState(true);

  useEffect(() => {
    if (isShowing) {
      bodyRef.current?.classList.add('translate-x-36');
    } else {
      bodyRef.current?.classList.remove('translate-x-36');
    }
  }, [isShowing]);

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
      />
      <div
        className={
          'h-[100vh] min-h-screen overflow-x-auto overflow-y-auto bg-[#222] duration-500 ease-in-out '
        }
        ref={bodyRef}
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
          className={`relative theme-${selectedTheme} flex h-[4.5rem] w-[full] items-center justify-center bg-[#111] font-mono text-lg font-bold text-primary`}
        >
          <button>
            <MenuIcon
              sidebarIsShowing={isShowing}
              sidebarIsShowingHandler={setIsShowing}
            />
          </button>
          <span
            className='absolute text-center duration-1000'
            ref={headerTitleRef}
          >
            Type Master
          </span>
        </header>
        <input
          type='text'
          ref={inputRef}
          className='w-1/2 cursor-default opacity-0 disabled:bg-white'
          onChange={handleInput}
          disabled={!gameStarted ? true : false}
        />
        <main
          className={`flex h-[80%] w-full items-center justify-center theme-${selectedTheme}`}
        >
          {isInstructionsMode ? (
            <div className='relative flex h-[80%] w-[70%] flex-col items-center justify-evenly rounded-2xl bg-[#111]'>
              <div className='absolute top-3 left-3 flex w-20 justify-around'></div>
              <div className='mt-8 text-center font-mono text-xl text-primary'>
                Instructions
              </div>
              <div className='my-5 text-center font-poppins text-white'>
                Welcome to Type Master, You will be shown a series of random
                words and
                <br />
                will have to type the prompted word within a certain time. The
                word count
                <br /> and the time limit to type each word is determined by the
                game&apos;s difficulty
              </div>
              <div>
                <div className='text-center font-poppins text-white'>
                  You are now playing on the{' '}
                  <span className='text-primary'>
                    <select
                      className='mx-1 border-none bg-primary font-poppins font-bold text-black outline-none'
                      onChange={changeDifficultyHandler}
                    >
                      <option
                        className='hover:text-[#111]'
                        selected={difficulty?.wordCount === 15 ? true : false}
                        value='0'
                      >
                        Easy
                      </option>
                      <option
                        selected={difficulty?.wordCount === 25 ? true : false}
                        value='1'
                      >
                        Normal
                      </option>
                      <option
                        selected={difficulty?.wordCount === 30 ? true : false}
                        value='2'
                      >
                        Hard
                      </option>
                    </select>
                  </span>{' '}
                  difficulity <br /> and you have{' '}
                  <span className='text-primary '>
                    {gameStarted
                      ? Math.trunc(timeLeft / 10)
                      : Math.trunc((difficulty?.timeLimit as number) / 10)}
                  </span>{' '}
                  seconds to type the each word
                  <span className='mt-2 block'>
                    Words to type:{' '}
                    <span className='text-primary '>
                      {difficulty?.wordCount}
                    </span>
                  </span>
                </div>
              </div>
              <button
                className='mt-5 block w-[50%] rounded-md bg-primary p-5 font-mono text-2xl font-bold duration-300 hover:scale-[1.04] hover:bg-hovered'
                onClick={gameStartHandler}
                ref={startButtonRef}
              >
                Start Playing
              </button>
            </div>
          ) : (
            <div className='relative flex h-[80%] w-[70%] flex-col items-center justify-center rounded-2xl bg-[#111]'>
              <div className='absolute top-3 left-3 flex w-24 justify-evenly'>
                <InstructionsIcon
                  isInstructionsMode={isInstructionsMode}
                  instructionsModeHandler={setIsInstructionsMode}
                />
                <DifficultyIcon
                  difficultyIsShowing={isShowingDropDown}
                  difficultyIsShowingHandler={setIsShowingDropDown}
                />
                <DifficultyDropdown
                  isActive={isShowingDropDown}
                  difficultyHandler={setDifficulty}
                />
                <ThemeIcon
                  themeIsShowing={themeIsShowing}
                  themeIsShowingHandler={setThemeIsShowing}
                />
                <ThemeDropdown
                  isActive={themeIsShowing}
                  currentThemeHandler={setSelectedTheme}
                />
              </div>
              <b className='absolute top-20 text-3xl text-white '>
                {gameResult}
              </b>
              <b
                className={`select-none text-center font-mono font-semibold duration-200 ${
                  isPlaying ? 'text-8xl' : 'absolute top-[30%] text-5xl'
                }`}
                ref={wordRef}
              >
                {splittedCurrentWord?.map((letter, idx) => (
                  <span key={idx} className={getLetterColor(idx, letter)}>
                    {letter}
                  </span>
                ))}
              </b>
              <div className='mt-5 flex w-full flex-wrap justify-center rounded-lg  p-4 text-center font-poppins text-base font-medium'>
                {isLoading ? (
                  'Loading...'
                ) : !gameStarted ? (
                  <b className='hidden'></b>
                ) : (
                  words.map((word: string) => {
                    return (
                      <b
                        key={word}
                        className=' ] m-1 rounded-md bg-primary p-[10px]'
                      >
                        {word}
                      </b>
                    );
                  })
                )}
              </div>
              <button
                className='absolute bottom-20 mt-5 hidden  w-[50%] rounded-md bg-primary  p-5 font-mono text-2xl font-bold duration-300 hover:scale-[1.04] hover:bg-hovered'
                onClick={gameStartHandler}
                ref={startButtonRef}
              >
                Start Playing
              </button>
              <div className='absolute bottom-0 flex w-full  justify-between rounded-lg p-4 text-center text-white'>
                <b>
                  Time Left:{' '}
                  <span className='text-primary'>
                    {gameStarted
                      ? Math.trunc(timeLeft / 10)
                      : Math.trunc((difficulty?.timeLimit as number) / 10)}
                  </span>{' '}
                  Seconds
                </b>
                <b>
                  Score: <span className='text-primary '>{score}</span> from{' '}
                  <span className='text-primary '>{difficulty?.wordCount}</span>
                </b>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
