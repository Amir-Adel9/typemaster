interface IconProps {
  isInstructionsMode: boolean;
  instructionsModeHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

const InstructionsIcon = (props: IconProps) => (
  <svg
    onClick={() => {
      props.instructionsModeHandler((prev) => !prev);
    }}
    className='cursor-pointer fill-primary duration-200 hover:scale-110'
    width={24}
    height={24}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 3.538a8.462 8.462 0 1 0 0 16.924 8.462 8.462 0 0 0 0-16.924ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Z'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 16.359a.77.77 0 0 0 .77-.77v-4.102a.77.77 0 1 0-1.54 0v4.103c0 .425.345.769.77.769Z'
    />
    <path d='M13.026 8.41a1.026 1.026 0 1 0-2.052 0 1.026 1.026 0 0 0 2.052 0Z' />
  </svg>
);

export default InstructionsIcon;
