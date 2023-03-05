/* eslint-disable @next/next/no-img-element */
import type { ChangeEvent, FormEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import BottomNavBar from './bottomNavBar';
import { trpc } from '../../utils/trpc';

interface SideBarProps {
  isShowing: boolean;
  isShowingHandler: React.Dispatch<React.SetStateAction<boolean>>;
  userData:
    | {
        id: string;
        displayName: string;
        timesPlayed: number;
        wins: number;
      }[]
    | undefined;
  currentUserData:
    | {
        id: string;
        displayName: string;
        imageURL: string;
        timesPlayed: number;
        wins: number;
        level: number;
        levelExp: number;
      }
    | undefined;
  theme: string;
  levelExp: number;
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

  // useEffect(() => {
  //   if (selectedTab === 'stats') {
  //     profilePictureRef.current?.classList.remove(
  //       'rounded-full',
  //       'scale-50',
  //       'w-1/3',
  //       'right-4'
  //     );
  //     profilePictureRef.current?.classList.add('2xl:w-[25rem]');
  //     displayNameRef.current?.classList.remove('right-7');
  //     displayNameRef.current?.classList.add('ml-2');
  //   } else {
  //     profilePictureRef.current?.classList.add(
  //       'rounded-full',
  //       'scale-50',
  //       'w-1/3',
  //       'right-4'
  //     );
  //     profilePictureRef.current?.classList.remove('2xl:w-[25rem]');
  //     displayNameRef.current?.classList.remove('ml-2');
  //     displayNameRef.current?.classList.add('right-7');
  //   }
  // }, [selectedTab]);

  const userRefs = useRef<HTMLDivElement[]>([]);

  userRefs.current = [];

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !userRefs.current.includes(el)) {
      userRefs.current.push(el);
    }
  };

  const [selectedImage, setSelectedImage] = useState<File>();
  const [isVisible, setIsVisible] = useState(false);
  const [base64code, setBase64code] = useState('');

  const ctx = trpc.useContext();

  const uploadImageMutation = trpc.user.uploadImage.useMutation({
    onSuccess: () => ctx.user.invalidate(),
  });

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0]);
    getBase64(event.target.files?.[0] as File);
  };

  const uploadImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedImage) return;
    uploadImageMutation.mutate({
      id: props.currentUserData?.id as string,
      imageBase64: base64code,
    });
    setIsVisible(!isVisible);
  };

  const onLoad = (fileString: string) => {
    setBase64code(fileString);
  };

  const getBase64 = (image: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      onLoad(reader.result as string);
    };
  };

  return (
    <div
      className={`fixed z-10 h-full w-[20%] -translate-x-[96rem] border-r-[1px] border-[#111] bg-[#111] duration-700 ease-in-out theme-${props.theme}`}
      ref={sideBarRef}
    >
      <div className='bg-green-5 border-b border-primary p-2'>
        <button
          className='float-right text-white'
          onClick={() => {
            props.isShowingHandler(false);
          }}
        >
          <b>X</b>
        </button>
        <div className='mb-5 flex items-center '>
          <span className='mr-5 h-16 w-16 overflow-hidden rounded-full border-2 border-primary'>
            <Image
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : props.currentUserData?.imageURL
                  ? props.currentUserData?.imageURL
                  : '/user.svg'
              }
              width={100}
              height={100}
              alt=''
              onClick={() => {
                setIsVisible(!isVisible);
              }}
              className='h-full w-full cursor-pointer  duration-300 ease-in-out hover:bg-primary hover:opacity-70'
              ref={profilePictureRef}
            />
          </span>
          <b className='text-white' ref={displayNameRef}>
            {props.currentUserData?.displayName}
          </b>
        </div>
        <form onSubmit={uploadImage} className={isVisible ? 'flex' : 'hidden'}>
          <input
            type='file'
            id='img'
            name='img'
            accept='image'
            className={`text-white`}
            onChange={onImageChange}
          />
          <button
            className='rounded-md bg-primary p-2 font-medium text-white duration-300 hover:scale-105 hover:bg-hovered'
            type='submit'
          >
            Confirm
          </button>
        </form>
        <b className='ml-2 text-white'>Lvl.1</b>
        <div className=' relative ml-2 h-3 w-[95%] rounded-full bg-gray-200 text-center'>
          <span className='absolute left-[45%] z-20 text-xs font-bold leading-none text-black'>
            {props.currentUserData?.levelExp?.toFixed(1)}%
          </span>
          <div
            className='absolute left-0 z-10 h-3 rounded-full bg-primary duration-1000'
            style={{ width: `${props.currentUserData?.levelExp}%` }}
          ></div>
        </div>
        <div className='ml-2 flex w-[95%] items-center justify-between'>
          <b className='float-left text-white'>
            Times Played: {props.currentUserData?.timesPlayed}
          </b>
          <b className=' float- text-white'>
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
                    <div className='pl-4'>
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
