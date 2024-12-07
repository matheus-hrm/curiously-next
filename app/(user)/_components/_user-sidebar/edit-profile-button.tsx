'use client';

import { Button } from '@/components/ui/button';
import { UserPen } from 'lucide-react';

export default function EditProfileButton({
  onEditProfile,
}: {
  onEditProfile: () => void;
}) {
  return (
    <>
      <Button
        variant="outline"
        className="w-full hover:bg-black/20"
        onClick={onEditProfile}
      >
        <p>Editar perfil</p>
        <UserPen className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
}
