import localFont from 'next/font/local';

const kiwi = localFont({
  src: '../app/fonts/KiwiMaru-Medium.ttf',
  variable: '--font-kiwi',
  weight: '400',
});

export const MainLogo = () => {
  return (
    <div className="text-5xl text-teal-500 m-4 pl-2 flex flex-col justify-center items-center">
      <p className={kiwi.className}>ナナシ</p>
      {/* <p className="text-xl font-mono text-black">nanashi</p> */}
    </div>
  );
};
