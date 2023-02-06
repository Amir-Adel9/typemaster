/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';

import { trpc } from '../utils/trpc';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import router from 'next/router';

import Sidebar from '../components/sidebar/sidebar';
import { useInterval } from '../utils/useInterval';

const Home: NextPage = () => {
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const storedDisplayName = localStorage.getItem('displayName') as string;
    const isRegistered = storedDisplayName ? true : false;
    if (!isRegistered) {
      router.push('/register');
      return;
    } else {
      setDisplayName(
        storedDisplayName.charAt(0).toUpperCase() + storedDisplayName.slice(1)
      );
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
  console.log(currentUserData);

  const increaseTimesPlayedMutation = trpc.user.increaseTimesPlayed.useMutation(
    {
      onSuccess: () => ctx.invalidate(),
    }
  );
  const userData = registeredDisplayNames.data?.map((name) => name);

  const difficulties = [
    {
      timeLimit: 70,
      wordCount: 15,
    },
    {
      timeLimit: 50,
      wordCount: 25,
    },
    {
      timeLimit: 30,
      wordCount: 30,
    },
  ];

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
  const displayNameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refetch();
  }, [difficulty]);

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

  const getLetterColor = (idx: number) => {
    if (!gameStarted) {
      return 'text-[#2fe691]';
    } else {
      if (splittedCurrentWord[idx] === inputRef?.current?.value[idx]) {
        return 'text-[#ecfd00]';
      } else {
        return 'text-[#2fe691]';
      }
    }
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === currentWord) {
      inputRef.current.value = '';
      setScore((prevScore) => prevScore + 1);
      if (words.length === 0) {
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
    increaseTimesPlayedMutation.mutate(currentUserData?.id as string);
    setScore(0);
    inputRef.current.value = '';
    startButtonRef.current?.classList.add('hidden');
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

      if (timeLeft === 1) {
        setIsPlaying(false);
        setGameStarted(false);
        setGameResult('You Lost');
        refetch();
        inputRef.current.value = '';
        startButtonRef.current?.classList.remove('hidden');
      }
    },
    isPlaying ? 100 : null
  );

  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isShowing) {
      bodyRef.current?.classList.add('translate-x-36');
      headerTitleRef.current?.classList.add(
        'xl:translate-x-[31rem]',
        '2xl:translate-x-[51rem]'
      );
      displayNameRef.current?.classList.add('hidden');
    } else {
      bodyRef.current?.classList.remove('translate-x-36');
      headerTitleRef.current?.classList.remove(
        'xl:translate-x-[31rem]',
        '2xl:translate-x-[51rem]'
      );
      displayNameRef.current?.classList.remove('hidden');
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
      />
      <div className={'main overflow-x-auto overflow-y-auto '} ref={bodyRef}>
        <header className='header'>
          <button>
            <img
              src='../../menu.svg'
              alt=''
              onClick={() => {
                setIsShowing((prev) => !prev);
              }}
            />
          </button>
          <span className='header-title' ref={headerTitleRef}>
            Type Master
          </span>
          <span className='header-user' ref={displayNameRef}>
            Welcome, {displayName}
          </span>
        </header>
        <main className='game-wrapper'>
          <div className='game-body'>
            <div className='game-info'>
              <b className=' text-white'>
                You are playing on the{' '}
                <span className='text-[#d0196e]'>
                  [
                  <select
                    className='mx-1 border-none bg-[#d0196e] font-poppins font-bold text-black outline-none'
                    onChange={changeDifficultyHandler}
                  >
                    <option value='0'>Easy</option>
                    <option value='1'>Normal</option>
                    <option value='2'>Hard</option>
                  </select>
                  ]
                </span>{' '}
                difficulity & you have{' '}
                <span className='text-[#d0196e]'>
                  {gameStarted
                    ? Math.trunc(timeLeft / 10)
                    : Math.trunc((difficulty?.timeLimit as number) / 10)}
                </span>{' '}
                seconds to type the word
              </b>
            </div>
            <b
              className='font-semibold; select-none text-center font-mono text-7xl'
              ref={wordRef}
            >
              {splittedCurrentWord?.map((letter, idx) => (
                <span key={idx} className={getLetterColor(idx)}>
                  {letter}
                </span>
              ))}
            </b>
            <input
              type='text'
              ref={inputRef}
              className='game-input'
              onChange={handleInput}
              disabled={!gameStarted ? true : false}
            />
            <button
              className='hover:invert; m-auto mt-5 block w-full rounded-md bg-[#d0196e] p-5 font-mono text-2xl font-bold duration-300 hover:scale-[1.04]'
              onClick={gameStartHandler}
              ref={startButtonRef}
            >
              Start Playing
            </button>
            <div className='words-box'>
              {isLoading ? (
                'Loading...'
              ) : !gameStarted ? (
                <b className=' m-1 rounded-md bg-[#d0196e] p-[10px]'>
                  Words will appear here
                </b>
              ) : (
                words.map((word: string) => {
                  return (
                    <b
                      key={word}
                      className=' m-1 rounded-md bg-[#d0196e] p-[10px]'
                    >
                      {word}
                    </b>
                  );
                })
              )}
            </div>
            <div className='game-state'>
              <b>
                Time Left:{' '}
                <span className='text-[#d0196e]'>
                  {gameStarted
                    ? Math.trunc(timeLeft / 10)
                    : Math.trunc((difficulty?.timeLimit as number) / 10)}
                </span>{' '}
                Seconds
              </b>
              <b>{gameResult}</b>
              <b>
                Score: <b className='text-[#d0196e]'>{score}</b> from{' '}
                <b className='text-[#d0196e]'>{difficulty?.wordCount}</b>
              </b>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
