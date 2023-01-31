/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import router from 'next/router';

interface SideBarProps {
  isShowing: boolean;
  isShowingHandler: Dispatch<SetStateAction<boolean>>;
  userData: string[] | undefined;
}

const Sidebar = (props: SideBarProps) => {
  const sideBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.isShowing
      ? sideBarRef.current?.classList.remove('-translate-x-96')
      : sideBarRef.current?.classList.add('-translate-x-96');
  }, [props.isShowing]);

  return (
    <div
      className={`fixed z-10 h-full w-[20%] -translate-x-96 border-r-[1px] bg-[#111] duration-700 ease-in-out`}
      ref={sideBarRef}
    >
      <button
        className='w-5 bg-[#2fe691]'
        onClick={() => {
          props.isShowingHandler(false);
          console.log(props.isShowing);
        }}
      >
        X
      </button>
      <div className='mt-3 flex flex-col text-white'>
        {props.userData?.map((user) => {
          return (
            <b key={user} className='border-b border-[#2fe691]'>
              {user}
            </b>
          );
        })}
      </div>
      <section className='absolute bottom-0 flex h-[7%] w-full cursor-pointer bg-[#2fe691]'>
        <div
          className='group flex h-full w-1/4 flex-col  items-center justify-center border-r bg-[#2fe691] text-center duration-300 hover:bg-[#3bb77d]'
          onClick={() => {
            localStorage.clear();
            router.push('/register');
          }}
        >
          <img
            src='../../logout.svg'
            alt='Logout'
            className='scale-[0.6] fill-white duration-300 group-hover:-translate-y-2 group-hover:scale-[0.5]'
          />
          <b className='absolute bottom-1 translate-y-20 duration-200 group-hover:translate-y-0'>
            Log Out
          </b>
        </div>
        <div className='group flex h-full w-2/4 flex-col items-center justify-center border-r bg-[#2fe691] p-3  duration-300 hover:bg-[#3bb77d]'>
          <img
            src='../../leaderboard.png'
            alt='Logout'
            className='scale-[0.7] fill-white duration-300 group-hover:-translate-y-2 group-hover:scale-[0.55]'
          />
          <b className='absolute bottom-1 translate-y-20 duration-200 group-hover:translate-y-0'>
            Leaderboard
          </b>
        </div>
        <div className='group flex h-full w-1/4 flex-col  items-center justify-center border-r bg-[#2fe691] text-center duration-300 hover:bg-[#3bb77d]'>
          <img
            src='../../stats.svg'
            alt='Logout'
            className=' fill-white duration-300 group-hover:-translate-y-2 group-hover:scale-[0.8]'
          />
          <b className='absolute bottom-1 translate-y-20 duration-200 group-hover:translate-y-0'>
            My Stats
          </b>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
