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

  useEffect(() => {
    const storedName = localStorage.getItem('displayName') as string;
    if (registeredDisplayNames.data?.includes(storedName)) {
      router.push('/');
    }
  }, [registeredDisplayNames]);

  const [displayName, setDisplayName] = useState('');
  const [invalidNameMessage, setInvalidNameMessage] = useState('');

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
      <main className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2c0416] via-[#3d041f] to-[#2e0b2e]'>
        <b className='  mt-36 bg-gradient-to-r from-[#2fe691] to-[#01b78a] bg-clip-text font-poppins text-7xl text-transparent'>
          Type Master
        </b>
        <div className='mt-36 flex flex-col items-center'>
          <form className='flex flex-col items-center' onSubmit={submitHandler}>
            <b className='block text-white'>Choose your display name</b>
            <b className='mt-3 block text-yellow-400'>{invalidNameMessage}</b>
            <input
              type='text'
              className='mt-5 block'
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
            <button
              className='mt-5 w-28 rounded-full bg-white duration-500 hover:bg-[#2fe691]'
              type='submit'
            >
              Confirm
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
