/* eslint-disable @next/next/no-img-element */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import BottomNavBar from './bottomNavBar';

interface SideBarProps {
  isShowing: boolean;
  isShowingHandler: Dispatch<SetStateAction<boolean>>;
  userData: string[] | undefined;
  currentUserData: { displayName: string };
}

const Sidebar = (props: SideBarProps) => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const profilePictureRef = useRef<HTMLImageElement>(null);
  const displayNameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.isShowing
      ? sideBarRef.current?.classList.remove('-translate-x-96')
      : sideBarRef.current?.classList.add('-translate-x-96');
  }, [props.isShowing]);

  const [selectedTab, setSelectedTab] = useState('leaderboard');

  useEffect(() => {
    if (selectedTab === 'stats') {
      profilePictureRef.current?.classList.remove(
        'rounded-full',
        'scale-50',
        'w-1/3',
        'right-4'
      );
      displayNameRef.current?.classList.remove('right-7');
      displayNameRef.current?.classList.add('ml-2');
    } else {
      profilePictureRef.current?.classList.add(
        'rounded-full',
        'scale-50',
        'w-1/3',
        'right-4'
      );
      displayNameRef.current?.classList.remove('ml-2');
      displayNameRef.current?.classList.add('right-7');
    }
  }, [selectedTab]);

  return (
    <div
      className='fixed z-10 h-full w-[20%] -translate-x-96 border-r-[1px] border-[#111] bg-[#111] duration-700 ease-in-out'
      ref={sideBarRef}
    >
      <div className='flex w-full flex-col items-start border-b border-[#2fe691]'>
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
            className='relative right-4 inline w-1/3 scale-50 rounded-full duration-500'
            ref={profilePictureRef}
          />
          <b className='relative right-7 text-white' ref={displayNameRef}>
            {props.currentUserData.displayName}
          </b>
        </div>
        <b className='ml-2 text-white'>Lvl.1</b>
        <div className='ml-2 mb-5 h-3 w-[80%] rounded-full bg-gray-200 dark:bg-gray-700'>
          <div className='h-3 w-[45%] rounded-full bg-[#2fe691]  text-center text-xs font-medium leading-none'>
            45%
          </div>
        </div>
      </div>
      <div>
        <div className='mt-3 flex flex-col text-white'>
          {selectedTab === 'leaderboard' ? (
            props.userData?.map((user) => {
              return (
                <b key={user} className='border-b border-[#2fe691]'>
                  {user}
                </b>
              );
            })
          ) : (
            <b></b>
          )}
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
