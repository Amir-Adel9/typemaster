/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';

import { trpc } from '../utils/trpc';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import router from 'next/router';

import Sidebar from '../components/sidebar';

const Home: NextPage = () => {
  const registeredDisplayNames = trpc.user.getAllDisplayNames.useQuery();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const storedDisplayName = localStorage.getItem('displayName') as string;
    const isRegistered = storedDisplayName ? true : false;
    if (!isRegistered) {
      router.push('/register');
      return;
    } else {
      setDisplayName(storedDisplayName);
    }
  }, []);

  const { isLoading, refetch } = useQuery(
    ['randomWords'],
    () =>
      fetch('https://random-word-api.herokuapp.com/word?number=5').then((res) =>
        res.json()
      ),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setWords(data);
      },
    }
  );

  const userData = registeredDisplayNames.data?.map((name) => name);

  const [words, setWords] = useState(['']);
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameResult, setGameResult] = useState('');

  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const currentWordHandler = () => {
    const randomWord = words[
      Math.floor(Math.random() * words.length)
    ] as string;
    setCurrentWord(randomWord);
    const wordIndex = words.indexOf(randomWord);
    words.splice(wordIndex, 1);
    return randomWord;
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === currentWord) {
      // inputRef.current.value = '';
      // currentWordHandler();
      // setCount((count) => count + 5);
    }
  };

  const gameStartHandler = () => {
    inputRef.current.value = '';
    setGameStarted(true);
    setIsPlaying(true);
    currentWordHandler();
    setTimeLeft(5);
    setGameResult('');
  };

  useInterval(
    () => {
      if (!gameStarted) {
        return;
      }
      setTimeLeft((timeLeft) => timeLeft - 1);
      if (inputRef.current.value === currentWord) {
        inputRef.current.value = '';
        if (words.length === 0) {
          setIsPlaying(false);
          setGameStarted(false);
          setGameResult('You Won!');
          refetch();
          inputRef.current.value = '';
        }
        currentWordHandler();
        setTimeLeft(5);
      }
      if (timeLeft === 1) {
        setIsPlaying(false);
        setGameStarted(false);
        setGameResult('You Lost');
        refetch();
        inputRef.current.value = '';
      }
      console.log(timeLeft);
    },
    isPlaying ? 1000 : null
  );

  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    isShowing
      ? bodyRef.current?.classList.add('translate-x-36')
      : bodyRef.current?.classList.remove('translate-x-36');
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
      />
      <div className={'main'} ref={bodyRef}>
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
          <span className='header-title'>Type Master</span>
          <span className='header-user'>Welcome, {displayName}</span>
        </header>
        <main className='game-wrapper'>
          <div className='game-body'>
            <div className='game-info'>
              <b className=' text-white'>
                You are playing on the{' '}
                <span className='text-[#d0196e]'>[Easy]</span> difficulity & you
                have <span className='text-[#d0196e]'>{timeLeft}</span> seconds
                to type the word
              </b>
            </div>
            <b className='the-word'>{currentWord}</b>
            <input
              type='text'
              ref={inputRef}
              className='w-full border'
              onChange={handleInput}
            />
            <button className='start-button' onClick={gameStartHandler}>
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
          </div>
          <Link
            href='/register'
            onClick={() => {
              localStorage.clear();
            }}
          >
            <p className='text-white hover:underline'>home</p>
          </Link>
        </main>
      </div>
    </>
  );
};

export default Home;

function useInterval(callback: any, delay: any) {
  const savedCallback = useRef(Function);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      // eslint-disable-next-line prefer-const
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
