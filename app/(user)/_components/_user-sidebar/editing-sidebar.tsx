'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CircleX, ImageUp, Link, LoaderCircle, Save } from 'lucide-react';
import { useRef, useState } from 'react';

type EditingSidebarProps = {
  user: {
    name: string;
    id: string;
    avatar: string;
    bio: string;
    socials: string[];
  };
  onClose: () => void;
};

export default function EditingSidebar({ onClose, user }: EditingSidebarProps) {
  const [imageHover, setImageHover] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newBio, setNewBio] = useState(user.bio);
  const [uploadError, setUploadError] = useState<String | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    setUploadError(null);

    if (!file) return setUploadError('No file selected');

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return setUploadError('File type not allowed');
    }

    if (file.size > MAX_FILE_SIZE) {
      return setUploadError('File is too big');
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      setIsLoading(true);
      const response = await fetch(`/api/${user.name}/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      onClose();
    } catch (error) {
      console.error(error);
      setUploadError('An error occurred');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className="relative">
      <Card className="sticky top-8 backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardContent className="p-6 space-y-3">
          <div className="flex flex-col justify-center items-center text-center ">
            {user.avatar ? (
              <>
                <Avatar
                  className="h-32 w-32 mb-4"
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <AvatarImage
                    className="rounded-full border-2 border-zinc-400"
                    src={user.avatar}
                    alt={user.name}
                  />
                  {imageHover && (
                    <Button
                      variant="outline"
                      onClick={handleSwitchProfilePicture}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white"
                    >
                      <ImageUp className="h-8 w-8" aria-hidden="true" />
                    </Button>
                  )}
                </Avatar>
              </>
            ) : (
              <>
                <div className="h-full w-full flex items-center justify-center rounded-full border-2 border-zinc-300">
                  <ImageUp
                    className="h-24 w-24 text-gray-500"
                    aria-hidden="true"
                  />
                </div>
              </>
            )}
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
          <Input
            defaultValue={newName}
            placeholder={user.name}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="space-y-4">
            <Textarea
              className="w-full h-24 text-start  resize-none"
              placeholder={user.bio}
              onChange={(e) => setNewBio(e.target.value)}
            />
          </div>
          {user.socials.length > 0 &&
            user.socials.map((url, i) => {
              return (
                <div key={url} className="flex flex-col w-full p-2">
                  <div className="flex flex-row max-h-5 justify-start items-center">
                    <Link key={i} className="w-4 h-4 mr-2" />
                    <Input
                      key={url}
                      defaultValue={url}
                      placeholder={url}
                      className="w-full text-sm font-extralight pl-4"
                    />
                  </div>
                </div>
              );
            })}
          <div className="flex flex-col w-full p-2">
            <div className="flex flex-row max-h-5 justify-start items-center">
              <Link className="w-4 h-4 mr-2" />
              <Input
                placeholder="Add a new link"
                className="w-full text-sm font-extralight pl-4"
              />
            </div>
          </div>
          {!isLoading ? (
            <>
              <Button
                className="bg-green-500 w-full flex flex-row items-center justify-center"
                variant="default"
              >
                <Save className="mr-2 h-4 w-4" />
                <p>Save</p>
              </Button>
              <Button
                className="bg-red-500 w-full flex flex-row items-center justify-center"
                variant="default"
                onClick={onClose}
              >
                <CircleX className="mr-2 h-4 w-4" />
                <p>Cancel</p>
              </Button>
            </>
          ) : (
            <Button
              className="bg-zinc-600 w-full flex flex-row items-center justify-center disabled"
              variant="default"
            >
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
