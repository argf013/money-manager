import {
  ChecklistIcon,
  DownloadIcon,
  SunIcon,
  UploadIcon,
} from '@primer/octicons-react';

const IconButton = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className='flex flex-col justify-center items-center gap-2'>
    <button className='bg-[#17A364] hover:bg-[#199c61] text-white rounded-[4px] p-[5px] w-[44px] h-[44px] flex items-center justify-center'>
      <Icon size={20} />
    </button>
    <span className='font-medium text-sm text-[#17A364]'>{label}</span>
  </div>
);

const ButtonContainer = () => {
  return (
    <div className='flex justify-center gap-7 px-5 py-8'>
      <IconButton icon={UploadIcon} label='Expense' />
      <IconButton icon={DownloadIcon} label='Income' />
      <IconButton icon={SunIcon} label='Set Daily' />
      <IconButton icon={ChecklistIcon} label='Export' />
    </div>
  );
};

export default ButtonContainer;
