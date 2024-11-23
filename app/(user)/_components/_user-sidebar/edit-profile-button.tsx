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
      <Button variant="outline" className="w-full" onClick={onEditProfile}>
        <p>Edit profile</p>
        <UserPen className="ml-2 h-4 w-4" />
      </Button>
    </>
  );
}
