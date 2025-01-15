'use client';

import { useCallback, useEffect, useState } from 'react';
import { debounce } from '@/lib/utils/debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';
import Modal from '@/components/ui/modal';
import { Check } from 'lucide-react';
import { z } from 'zod';

type ChangeHandleProps = {
  username: string;
  isOpen: boolean;
  onClose: () => void;
};

type valid = 'valid' | 'invalid' | 'default';

export default function ChangeHandle({
  isOpen,
  onClose,
  username,
}: ChangeHandleProps) {
  const [newHandle, setNewHandle] = useState('');
  const [isValid, setIsValid] = useState<valid>('default');
  const [zodError, setZodError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setNewHandle('');
    setIsValid('default');
    onClose();
  };

  const handleSchema = z
    .string()
    .min(3, { message: 'Username deve ter no minimo 3 caracteres' })
    .max(15, { message: 'Username deve ter no máximo 15 caracteres' });
  const validateHandle = async (handle: string) => {
    if (newHandle === '') {
      setIsValid('default');
      return;
    }

    setIsLoading(true);

    try {
      handleSchema.parse(handle);
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: handle }),
      });

      if (!response.ok) {
        setIsValid('invalid');
        return;
      }

      const data = (await response.json()) as { isUnique: boolean };

      if (data.isUnique) {
        setIsValid('valid');
      } else {
        setIsValid('invalid');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setZodError(error.errors[0].message);
      } else {
        setIsValid('invalid');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const debouncedValidateHandle = useCallback(
    (handle: string) => {
      debounce(validateHandle, 1000)(handle);
    },
    [handleSchema, setIsLoading, setIsValid, setZodError],
  );
  useEffect(() => {
    debouncedValidateHandle(newHandle);
  }, [newHandle, debouncedValidateHandle]);

  const submitHandle = async (newHandle: string) => {
    const response = await fetch(`/api/${username}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newHandle }),
    });
    const data = await response.json();
    if (data.user) {
      redirect(`/${newHandle}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className=" bg-white backdrop-blur-xl  flex flex-col justify-center items-start mt-5 p-16 rounded-lg space-y-3">
        <div className="flex flex-row items-center justify-center space-x-2">
          <Input
            className={`w-full` + (isValid === 'valid' && ' border-green-500')}
            type="text"
            placeholder={`@${username}`}
            value={newHandle}
            onChange={(event) => setNewHandle(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                setIsValid('default');
              }
            }}
          />
          <Button variant="ghost" onClick={() => validateHandle(newHandle)}>
            <Check />
          </Button>
        </div>
        {isLoading ? (
          <p className="text-black/60">Validando...</p>
        ) : (
          <>
            {isValid === 'valid' && (
              <p className="text-green-500 mt-2">Username disponível</p>
            )}
            {isValid === 'invalid' && (
              <p className="text-red-500 mt-2">Username já existe</p>
            )}
          </>
        )}
        <div className={` ` + (zodError && 'animate-shake transition-all')}>
          <p className={`text-stone-500 text-sm `}>
            {zodError ? zodError : 'Username deve ter entre 3 e 15 caracteres'}
          </p>
        </div>
        <div className="disabled:bg-slate-300 bg-stone-600 w-full rounded-lg text-white">
          <Button
            variant="default"
            onClick={() => submitHandle(newHandle)}
            disabled={isValid === 'invalid' || isValid === 'default'}
            className={`w-full `}
          >
            <p className="">Salvar</p>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
