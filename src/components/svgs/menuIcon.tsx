interface MenuIconProps {
  sidebarIsShowing: boolean;
  sidebarIsShowingHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuIcon = (props: MenuIconProps) => (
  <svg
    width='32px'
    height='32px'
    viewBox='0 0 24 24'
    className={`absolute top-[30%] left-5 z-20 -scale-y-100 fill-white duration-300 hover:scale-x-[1.1] hover:-scale-y-[1.1] hover:animate-pulse hover:fill-primary ${
      props.sidebarIsShowing ? 'hidden' : ''
    }`}
    xmlns='http://www.w3.org/2000/svg'
    onClick={() => {
      props.sidebarIsShowingHandler((prev) => !prev);
    }}
    {...props}
  >
    <g>
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z' />
    </g>
  </svg>
);
export default MenuIcon;
