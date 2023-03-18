import { difficulties } from '../../constants/difficulties';

interface DifficultyDropdownProps {
  isActive: boolean;
  difficultyHandler: React.Dispatch<
    React.SetStateAction<{ timeLimit: number; wordCount: number }>
  >;
}

const DifficultyDropdown = (props: DifficultyDropdownProps) => {
  return (
    <div
      className={`absolute left-8 top-7 cursor-pointer border border-primary bg-primary font-mono text-black ${
        !props.isActive ? 'hidden' : ''
      }`}
    >
      <ul>
        <li
          className='p-1 hover:bg-[#111] hover:text-primary'
          onClick={() => {
            props.difficultyHandler(difficulties[0]!);
          }}
        >
          Easy
        </li>
        <li
          className='p-1 hover:bg-[#111] hover:text-primary'
          onClick={() => {
            props.difficultyHandler(difficulties[1]!);
          }}
        >
          Normal
        </li>
        <li
          className='p-1 hover:bg-[#111] hover:text-primary'
          onClick={() => {
            props.difficultyHandler(difficulties[2]!);
          }}
        >
          Hard
        </li>
      </ul>
    </div>
  );
};

export default DifficultyDropdown;
