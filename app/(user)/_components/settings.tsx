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

export default function Settings() {
  return (
    <>
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
          <DropdownMenuItem>
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
