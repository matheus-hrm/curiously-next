'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AtSignIcon, LogOut, SettingsIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import ChangeHandle from './change-handle';

type SettingsProps = {
  username: string;
};

export default function Settings({ username }: SettingsProps) {
  const [changeUsername, setChangeUsername] = useState(false);

  function setModalClose() {
    setChangeUsername(false);
  }

  return (
    <>
      {changeUsername && (
        <div className="bg-white">
          <ChangeHandle
            username={username}
            isOpen={changeUsername}
            onClose={setModalClose}
          />
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="m-2 outline-2 flex flex-row items-center justify-center text-black"
            variant="outline"
          >
            <SettingsIcon className="size-14" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setChangeUsername(true)}>
            <p className=" text-md">Mudar username</p>
            <AtSignIcon className="w-12 mr-2 size-14" aria-hidden="true" />
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-black/10" />
          <DropdownMenuItem
            className="hover:bg-black/10 text-red-500 cursor-pointer"
            onClick={() => {
              signOut();
            }}
          >
            <p className=" text-md font-semibold">Sair</p>
            <LogOut className="w-12 mr-2 size-14" aria-hidden="true" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
