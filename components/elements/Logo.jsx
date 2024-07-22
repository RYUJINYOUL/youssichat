import React from 'react';
import Image from 'next/image';
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from 'next/navigation';
import IconButton from "./IconButton";
import Link from "next/link";

const Logo = () => {
  const { push } = useRouter();
  const onClickLogo = () => {
    push("/");
  };

  const onClickMenu = () => {

  };

  return (
  <section className="flex flex-row items-center gap-3">
     <Link href={'/library'}><IconButton
          onClickIcon={onClickMenu}
          icon={<RxHamburgerMenu size={24} />}
        /></Link>
    <div className='cursor-pointer' onClick={onClickLogo}>
      <Image width={100} height={30} src={"/main-logo.svg"} />
    </div>
  </section>
  );
};

export default Logo
