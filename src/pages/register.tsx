/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FormEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import { themes } from '../constants/themes';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [invalidNameMessage, setInvalidNameMessage] = useState('');

  const [isHovered, setIsHovered] = useState(false);

  const [selectedTheme, setSelectedTheme] = useState('');

  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const ctx = trpc.useContext();

  const setDisplayNameMutation = trpc.user.setDisplayName.useMutation({
    onSuccess: () => ctx.invalidate(),
  });

  const registeredDisplayNames = trpc.user.getAllDisplayNames.useQuery();

  useEffect(() => {
    const storedTheme = localStorage.getItem('selectedTheme') as string;

    if (!storedTheme) {
      setSelectedTheme(themes[0] as string);
    } else {
      setSelectedTheme(storedTheme);
    }

    titleRef.current?.classList.remove('-translate-y-96');
    textRef.current?.classList.remove('-translate-y-[900px]');
    inputRef.current?.classList.remove('-translate-y-[1100px]');
    buttonRef.current?.classList.remove('-translate-y-[1200px]');
    iconsRef.current?.classList.remove('translate-y-24');

    setTimeout(() => {
      buttonRef.current?.classList.remove('duration-[1800ms]');
      buttonRef.current?.classList.add('duration-after');
    }, 2000);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('displayName') as string;
    if (
      registeredDisplayNames.data?.includes(
        storedName?.charAt(0).toUpperCase() + storedName?.slice(1)
      )
    ) {
      router.push('/');
    }
  }, [registeredDisplayNames]);

  const submitHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!displayName) {
      setInvalidNameMessage('Display name cannot be empty');
      return;
    }
    if (displayName.length <= 2) {
      setInvalidNameMessage('Display name must at least be 3 characters long');
      return;
    }
    localStorage.setItem('displayName', displayName);
    setDisplayNameMutation.mutate(displayName);
  };

  return (
    <>
      <Head>
        <title>Type Master</title>
        <meta name='description' content='Type Master by Amir Adel' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-center bg-[#222] theme-${selectedTheme}`}
      >
        <b
          className='absolute top-10 hidden -translate-y-96 bg-gradient-to-r from-primary to-hovered bg-clip-text font-poppins text-5xl text-transparent duration-1000 ease-out'
          ref={titleRef}
        >
          Type Master
        </b>
        <div className='mt-7  h-[30rem] w-[50%] rounded-xl bg-[#111]'>
          <img
            src='../../boyohboy.jpg'
            alt='boyohboy'
            className='float-right h-full w-[40%] select-none rounded-xl rounded-l-none border-l-2 duration-300 hover:scale-105'
          />

          <form
            className='flex h-full w-[60%] flex-col items-center'
            onSubmit={submitHandler}
          >
            <b
              className=' title relative mt-5 font-poppins text-5xl'
              ref={textRef}
            >
              Type Master...
            </b>
            <div className='absolute top-[50%] flex w-[29%] flex-col items-center justify-center'>
              <b
                className='-translate-y-[900px] font-mono text-2xl text-white duration-[1500ms]  ease-out'
                ref={textRef}
              >
                Choose your display name
              </b>
              <b className='mt-3 text-wrong'>{invalidNameMessage}</b>
              <input
                type='text'
                className='mt-5  w-[80%] -translate-y-[1100px] rounded border border-white text-center duration-[1900ms] ease-out'
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                ref={inputRef}
              />
              <button
                className='mt-10 h-16 w-[90%] -translate-y-[1200px] rounded-md bg-primary  font-mono font-semibold text-black duration-[1800ms] ease-in hover:scale-105 hover:bg-hovered hover:font-bold'
                type='submit'
                ref={buttonRef}
              >
                Confirm
              </button>
            </div>
          </form>
        </div>

        <div
          className='absolute bottom-5 flex translate-y-24 items-center duration-1000 ease-out'
          ref={iconsRef}
        >
          <Link
            href='https://github.com/Amir-Adel9/typemaster-plus'
            target='_blank'
          >
            <img
              src='../../github.svg'
              alt='Github'
              className='mr-7 scale-125 duration-200 hover:scale-150 '
            />
          </Link>
          <Link
            href='https://www.linkedin.com/in/amir-adel312/'
            target='_blank'
          >
            <img
              src='../../linkden.svg'
              alt='Linkden'
              className='mr-7 scale-125 duration-200 hover:scale-150'
            />
          </Link>
          <span
            className={
              isHovered ? 'discord-tooltip' : 'discord-tooltip opacity-0'
            }
          >
            iLegit#3503
          </span>
          <img
            src='../../discord.svg'
            alt='Discord'
            className='inline-block duration-200 hover:scale-[1.15]'
            onMouseOver={() => {
              setIsHovered(true);
            }}
            onMouseOut={() => {
              setTimeout(() => {
                setIsHovered(false);
              }, 2500);
            }}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
