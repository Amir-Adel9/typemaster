/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useState } from 'react';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const router = useRouter();
  const ctx = trpc.useContext();

  const setDisplayNameMutation = trpc.user.setDisplayName.useMutation({
    onSuccess: () => ctx.invalidate(),
  });

  const registeredDisplayNames = trpc.user.getAllDisplayNames.useQuery();

  const [translationValues, setTranslationValues] = useState({
    title: 96,
    text: 900,
    input: 1100,
    button: 1200,
    icons: 24,
  });
  const [buttonDurationHelper, setButtonDurationHelper] = useState(false);
  useEffect(() => {
    setTranslationValues({ title: 0, text: 0, input: 0, button: 0, icons: 0 });
    setTimeout(() => {
      setButtonDurationHelper(true);
    }, 2000);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('displayName') as string;
    if (registeredDisplayNames.data?.includes(storedName)) {
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
      <main className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#111] via-[#111] to-[#3e0620]'>
        <b
          className={`mt-36 -translate-y-${translationValues.title} bg-gradient-to-r from-[#2fe691] to-[#01b78a] bg-clip-text font-poppins text-9xl text-transparent duration-1000 ease-out`}
        >
          Type Master
        </b>
        <form
          className='mt-48 flex flex-col items-center'
          onSubmit={submitHandler}
        >
          <b
            className={`block -translate-y-[${translationValues.text}px] text-white duration-[1500ms] ease-out`}
          >
            Choose your display name
          </b>
          <b className='mt-3 block text-yellow-400'>{invalidNameMessage}</b>
          <input
            type='text'
            className={`mt-5 block -translate-y-[${translationValues.input}px] duration-[1900ms] ease-out`}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <button
            className={`mt-5 w-28 -translate-y-[${
              translationValues.button
            }px] rounded-md bg-[#2fe691] font-semibold text-white duration-[${
              buttonDurationHelper ? 300 : 1800
            }ms] ease-in hover:scale-110 hover:bg-[#3bb77d] hover:font-bold hover:text-white`}
            type='submit'
          >
            Confirm
          </button>
        </form>
        <div
          className={`mt-72 flex translate-y-${translationValues.icons} items-center duration-1000 ease-out`}
        >
          <Link
            href='https://github.com/Amir-Adel9/typemaster-plus'
            target='_blank'
          >
            <img
              src='../../github.svg'
              alt='Github'
              className='mr-7 scale-125 duration-200 hover:scale-150'
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
              isHovered
                ? ' absolute bottom-[110%] left-[60%] z-10 rounded bg-[#2fe691] p-1 duration-500 ease-in'
                : ' absolute bottom-[110%] left-[60%] z-10 rounded bg-[#2fe691] p-1 opacity-0 duration-500'
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
