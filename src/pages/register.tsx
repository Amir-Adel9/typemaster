/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const router = useRouter();
  const ctx = trpc.useContext();

  const setDisplayNameMutation = trpc.user.setDisplayName.useMutation({
    onSuccess: () => ctx.invalidate(),
  });

  const registeredDisplayNames = trpc.user.getAllDisplayNames.useQuery();

  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const [displayName, setDisplayName] = useState('');
  const [invalidNameMessage, setInvalidNameMessage] = useState('');

  const [isHovered, setIsHovered] = useState(false);

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
      <main className='register'>
        <b className='title -translate-y-96' ref={titleRef}>
          Type Master
        </b>
        <form className='reg-form' onSubmit={submitHandler}>
          <b className='choose -translate-y-[900px]' ref={textRef}>
            Choose your display name
          </b>
          <b className='invalid'>{invalidNameMessage}</b>
          <input
            type='text'
            className='reg-input -translate-y-[1100px]'
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            ref={inputRef}
          />
          <button
            className='confirm -translate-y-[1200px]'
            type='submit'
            ref={buttonRef}
          >
            Confirm
          </button>
        </form>
        <div className='icons translate-y-24' ref={iconsRef}>
          <Link
            href='https://github.com/Amir-Adel9/typemaster-plus'
            target='_blank'
          >
            <img src='../../github.svg' alt='Github' className='github ' />
          </Link>
          <Link
            href='https://www.linkedin.com/in/amir-adel312/'
            target='_blank'
          >
            <img src='../../linkden.svg' alt='Linkden' className='linkden' />
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
            className='discord'
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
