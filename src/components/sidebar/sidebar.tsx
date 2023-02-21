/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';

import BottomNavBar from './bottomNavBar';

interface SideBarProps {
  isShowing: boolean;
  isShowingHandler: React.Dispatch<React.SetStateAction<boolean>>;
  userData:
    | { id: string; displayName: string; timesPlayed: number; wins: number }[]
    | undefined;
  currentUserData:
    | { id: string; displayName: string; timesPlayed: number; wins: number }
    | undefined;
  theme: string;
}

const Sidebar = (props: SideBarProps) => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const profilePictureRef = useRef<HTMLImageElement>(null);
  const displayNameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.isShowing
      ? sideBarRef.current?.classList.remove('-translate-x-[96rem]')
      : sideBarRef.current?.classList.add('-translate-x-[96rem]');
  }, [props.isShowing]);

  const [selectedTab, setSelectedTab] = useState('leaderboard');

  // Organize
  const data = props.userData;
  const users = data?.map((user) => {
    return user;
  });
  const sortedUsers = users?.sort((a, b) => {
    return b.wins - a.wins;
  });

  useEffect(() => {
    if (selectedTab === 'stats') {
      profilePictureRef.current?.classList.remove(
        'rounded-full',
        'scale-50',
        'w-1/3',
        'right-4'
      );
      profilePictureRef.current?.classList.add('2xl:w-[25rem]');
      displayNameRef.current?.classList.remove('right-7');
      displayNameRef.current?.classList.add('ml-2');
    } else {
      profilePictureRef.current?.classList.add(
        'rounded-full',
        'scale-50',
        'w-1/3',
        'right-4'
      );
      profilePictureRef.current?.classList.remove('2xl:w-[25rem]');
      displayNameRef.current?.classList.remove('ml-2');
      displayNameRef.current?.classList.add('right-7');
    }
  }, [selectedTab]);

  const userRefs = useRef<HTMLDivElement[]>([]);

  userRefs.current = [];

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !userRefs.current.includes(el)) {
      userRefs.current.push(el);
    }
  };
  return (
    <div
      className={` fixed z-10 h-full w-[20%] -translate-x-[96rem] border-r-[1px] border-[#111] bg-[#111] duration-700 ease-in-out theme-${props.theme}`}
      ref={sideBarRef}
    >
      <div className='flex w-full flex-col items-start border-b border-primary pb-3'>
        <button
          className='absolute left-[95%] z-10 text-white'
          onClick={() => {
            props.isShowingHandler(false);
          }}
        >
          <b>X</b>
        </button>
        <div>
          <img
            src='../../favicon.ico'
            alt='profile'
            className='relative right-4 inline w-1/3 scale-50 rounded-full duration-300 ease-in-out'
            ref={profilePictureRef}
          />
          <b className='relative right-7 text-white' ref={displayNameRef}>
            {props.currentUserData?.displayName}
          </b>
        </div>
        <b className='ml-2 text-white'>Lvl.1</b>
        <div className='ml-2 mb-5 h-3 w-[80%] rounded-full bg-gray-200 dark:bg-gray-700'>
          <div className='h-3 w-[45%] rounded-full bg-primary  text-center text-xs font-medium leading-none'>
            45%
          </div>
          <b className='float-left text-white'>
            Times Played: {props.currentUserData?.timesPlayed}
          </b>
          <b className=' float-right text-white'>
            Wins: {props.currentUserData?.wins}
          </b>
        </div>
      </div>
      <div>
        <div className=' text-white'>
          <ol className='max-h-[46.6rem]  overflow-auto scrollbar-hide'>
            {selectedTab === 'leaderboard' ? (
              sortedUsers?.map((user, idx) => {
                return (
                  <li
                    key={user.id}
                    className=' border-b-[1px] border-primary py-2 duration-300'
                  >
                    <div className='ml-2'>
                      <b>{user.displayName}</b>
                      <span
                        className='float-right mr-5 cursor-pointer'
                        onClick={() => {
                          if (
                            userRefs.current[idx]?.classList.contains('hidden')
                          ) {
                            userRefs.current[idx]?.classList.remove('hidden');
                          } else {
                            userRefs.current[idx]?.classList.add('hidden');
                          }
                        }}
                      >
                        v
                      </span>
                      <div
                        className='mx-2 flex hidden justify-between'
                        ref={addToRefs}
                      >
                        <div>Times Played: {user.timesPlayed}</div>
                        <div>Wins: {user.wins}</div>
                      </div>
                    </div>
                    <div></div>
                  </li>
                );
              })
            ) : (
              <b></b>
            )}
          </ol>
        </div>
      </div>
      <BottomNavBar
        selectedTab={selectedTab}
        selectedTabHandler={setSelectedTab}
      />
    </div>
  );
};

export default Sidebar;
