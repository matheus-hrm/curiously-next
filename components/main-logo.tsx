import Image from 'next/image';
import Logo from '@/public/Curiously.png';

type MainLogoProps = {
  size?: number;
};

export const MainLogo = ({ size }: MainLogoProps) => {
  return (
    <div className="m-2 pl-1 text-center sm:text-start sm:m-4 sm:pl-2">
      <Image src={Logo} width={size ? size : 100} alt={''} />
    </div>
  );
};
