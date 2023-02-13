import { themes } from '../../constants/themes';

interface ThemeDropDownProps {
  isActive: boolean;
  currentThemeHandler: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeDropdown = (props: ThemeDropDownProps) => {
  return (
    <div
      className={`absolute left-16 top-7 cursor-pointer border border-primary bg-primary font-mono ${
        !props.isActive ? 'hidden' : ''
      }`}
    >
      <ul>
        <li
          className='p-1 hover:bg-[#111] hover:text-[#2fe691]'
          onClick={() => {
            props.currentThemeHandler(themes[0] as string);
          }}
        >
          Emerald
        </li>
        <li
          className='p-1 hover:bg-[#111] hover:text-[#d0196e]'
          onClick={() => {
            props.currentThemeHandler(themes[1] as string);
          }}
        >
          Diva
        </li>
        <li
          className='p-1 hover:bg-[#111] hover:text-[#A855F7] '
          onClick={() => {
            props.currentThemeHandler(themes[2] as string);
          }}
        >
          Lavender
        </li>
        <li
          className='p-1 hover:bg-[#111] hover:text-[#fde047]'
          onClick={() => {
            props.currentThemeHandler(themes[3] as string);
          }}
        >
          Ember
        </li>
        <li
          className='p-1 hover:bg-[#111] hover:text-[#9f2727]'
          onClick={() => {
            props.currentThemeHandler(themes[4] as string);
          }}
        >
          Crimson
        </li>
        <li
          className='p-1 hover:bg-[#111] hover:text-[#366cbd]'
          onClick={() => {
            props.currentThemeHandler(themes[5] as string);
          }}
        >
          Azure
        </li>
      </ul>
    </div>
  );
};

export default ThemeDropdown;
