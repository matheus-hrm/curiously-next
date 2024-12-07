'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <>
      <Button
        className="m-2 outline-2 flex flex-row items-center justify-center text-red-500"
        onClick={() => {
          signOut();
        }}
        variant="outline"
      >
        <p className=" text-md font-semibold">Sair</p>
        <LogOut className="w-12 mr-2 size-14" aria-hidden="true" />
      </Button>
    </>
  );
}
