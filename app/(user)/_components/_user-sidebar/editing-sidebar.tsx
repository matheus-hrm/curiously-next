'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Check,
  CircleMinus,
  CircleX,
  ImageUp,
  Link,
  LoaderCircle,
  Save,
} from 'lucide-react';
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

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function EditingSidebar({ onClose, user }: EditingSidebarProps) {
  const [imageHover, setImageHover] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newBio, setNewBio] = useState(user.bio);
  const [uploadError, setUploadError] = useState<String | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socials, setSocials] = useState(user.socials);
  const [newSocial, setNewSocial] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSwitchProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const handleAddSocial = () => {
    if (!newSocial) return;
    try {
      new URL(newSocial);
      setSocials([...socials, newSocial]);
      setNewSocial('');
    } catch {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      if (fileInputRef.current?.files?.length) {
        await handleImageUpload();
      }

      const response = await fetch(`/api/${user.name}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          bio: newBio,
          socials,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      onClose();
    } catch (error) {
      console.log(error);
      setUploadError('An error occurred');
      toast({
        title: 'An error occurred',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    setUploadError(null);

    if (!file) return setUploadError('No file selected');

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return setUploadError('File type not allowed');
    }

    if (file.size > MAX_FILE_SIZE) {
      return setUploadError('File is too big');
    }

    setSelectedFile(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setIsLoading(true);
      const response = await fetch(`/api/${user.name}/update/avatar`, {
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

      toast({
        title: 'Foto de perfil atualizada',
        description: 'Sua foto de perfil foi atualizada com sucesso',
      });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);
      setUploadError('An error occurred');
      toast({
        title: 'Ocorreu um erro',
        description: 'Falha ao carregar a imagem',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Card className="sticky top-8 backdrop-blur-lg bg-white/80 border-none shadow-lg">
        <CardContent className="p-6 space-y-3">
          <div className="flex flex-col justify-center items-center text-center ">
            {user.avatar && (
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
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute h-32 inset-0 flex items-center justify-center bg-black/30 transition-all duration-400 hover:bg-black/60 border-0 hover:text-white"
                    >
                      <ImageUp className="h-8 w-8" aria-hidden="true" />
                    </Button>
                  )}
                </Avatar>
              </>
            )}
            {!user.avatar && (
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
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={handleImageChange}
            ></Input>
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
          {socials.slice(0, 7).map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="flex flex-row items-center space-x-2 p-2"
            >
              <Link className="w-4 h-4" />
              <Input
                value={url}
                onChange={(e) => {
                  const newSocials = [...socials];
                  newSocials[index] = e.target.value;
                  setSocials(newSocials);
                }}
                className="flex-grow text-sm font-extralight"
                placeholder="https://..."
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveSocial(index)}
              >
                <CircleMinus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {socials.length < 7 && (
            <div className="flex flex-row items-center space-x-2 p-2">
              <Link className="w-4 h-4" />
              <Input
                value={newSocial}
                onChange={(e) => setNewSocial(e.target.value)}
                className="flex-grow text-sm font-extralight"
                placeholder="Adicionar novo link..."
              />
              <Button variant="ghost" size="icon" onClick={handleAddSocial}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          )}

          {!isLoading ? (
            <div className="flex flex-row justify-evenly space-x-5 text-white/90">
              <Button
                className="bg-green-800 flex flex-row items-center justify-center"
                variant="default"
                onClick={handleUpdateProfile}
              >
                <Save className="mr-1 h-4 w-4" />
                <p className="text-sm mr-3">Salvar</p>
              </Button>
              <Button
                className="bg-red-800 hover:bg-red-950 flex flex-row items-center justify-center"
                variant="default"
                onClick={onClose}
              >
                <CircleX className="mr-1 h-4 w-4" />
                <p className="text-sm">Cancelar</p>
              </Button>
            </div>
          ) : (
            <Button
              className="bg-zinc-600 flex flex-row items-center justify-center disabled"
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
