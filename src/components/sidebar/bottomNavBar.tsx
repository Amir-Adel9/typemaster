/* eslint-disable @next/next/no-img-element */
import router from 'next/router';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

interface BottomNavBarProps {
  selectedTab: string;
  selectedTabHandler: Dispatch<SetStateAction<string>>;
}
const BottomNavBar = (props: BottomNavBarProps) => {
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const myStatsRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState(leaderboardRef);

  const handleSelection = () => {
    selected.current?.classList.add('bg-[#2fe691]');
    selected.current?.classList.remove('bg-[#BBB]');

    ('border-[#2fe691]');
    selected.current?.firstElementChild?.classList.remove('-translate-y-2');
    selected.current?.lastElementChild?.classList.add('translate-y-20');
    selected.current?.lastElementChild?.classList.remove('translate-y-0');
    if (selected === leaderboardRef) {
      selected.current?.firstElementChild?.classList.remove('scale-[0.55]');
    } else {
      selected.current?.classList.remove('border-[#EEE]');
      selected.current?.classList.add('border-[#2fe691]');
      selected.current?.firstElementChild?.classList.remove('scale-[0.8]');
    }
  };

  useEffect(() => {
    selected.current?.classList.remove('bg-[#2fe691]');
    selected.current?.classList.add('bg-[#BBB]');
    selected.current?.firstElementChild?.classList.add('-translate-y-2');
    selected.current?.lastElementChild?.classList.remove('translate-y-20');
    selected.current?.lastElementChild?.classList.add('translate-y-0');
    if (selected === leaderboardRef) {
      props.selectedTabHandler('leaderboard');
      selected.current?.firstElementChild?.classList.add('scale-[0.55]');
    } else {
      props.selectedTabHandler('stats');
      selected.current?.firstElementChild?.classList.add('scale-[0.8]');
      selected.current?.classList.remove('border-r');
    }
  }, [selected]);
  return (
    <section className='absolute bottom-0 flex h-[7%] w-full cursor-pointer rounded-sm bg-[#2fe691]'>
      <div
        className='group flex h-full w-1/4 flex-col  items-center justify-center  bg-[#2fe691] text-center duration-300 hover:bg-red-500'
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
        <b className='absolute bottom-1 translate-y-20 text-sm duration-200 group-hover:translate-y-0'>
          Log Out
        </b>
      </div>
      <div
        className='group flex h-full w-2/4 flex-col items-center justify-center bg-[#2fe691] p-3 duration-300 hover:bg-[#3bb77d]'
        ref={leaderboardRef}
        onClick={() => {
          if (selected != leaderboardRef) {
            setSelected(leaderboardRef);
            handleSelection();
          } else {
            return;
          }
        }}
      >
        <img
          src='../../leaderboard.png'
          alt='Logout'
          className='scale-[0.6] fill-white duration-300 group-hover:-translate-y-2 group-hover:scale-[0.55]'
        />
        <b className='absolute bottom-1 translate-y-20 text-sm duration-200 group-hover:translate-y-0'>
          Leaderboard
        </b>
      </div>
      <div
        className='group flex h-full w-1/4 flex-col items-center justify-center border-r border-[#2fe691] bg-[#2fe691] text-center duration-300 hover:bg-[#3bb77d]'
        ref={myStatsRef}
        onClick={() => {
          if (selected != myStatsRef) {
            setSelected(myStatsRef);
            handleSelection();
          } else {
            return;
          }
        }}
      >
        <img
          src='../../stats.svg'
          alt='Logout'
          className=' fill-white duration-300 group-hover:-translate-y-2 group-hover:scale-[0.8]'
        />
        <b className='absolute bottom-1 translate-y-20 text-sm duration-200 group-hover:translate-y-0'>
          My Stats
        </b>
      </div>
    </section>
  );
};

export default BottomNavBar;
