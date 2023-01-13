import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';

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
        className='w-5 bg-red-500'
        onClick={() => {
          props.isShowingHandler(false);
          console.log(props.isShowing);
        }}
      >
        X
      </button>
      <div className='mt-3 flex flex-col text-white'>
        {props.userData?.map((user) => {
          return <b key={user}>{user}</b>;
        })}
      </div>
    </div>
  );
};

export default Sidebar;
