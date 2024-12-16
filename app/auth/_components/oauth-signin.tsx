import { SVGIcons } from '@/components/Icons';
import { signInWithDiscord, signInWithGoogle } from '../signin/actions';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

type OAuthProvider = {
  name: string;
  icon: keyof typeof SVGIcons;
  color: string;
  action: () => Promise<void>;
}[];

const Providers: OAuthProvider = [
  {
    name: 'Google',
    icon: 'google',
    color: 'bg-white',
    action: signInWithGoogle,
  },
  {
    name: 'Discord',
    icon: 'discord',
    color: 'bg-blue-600',
    action: signInWithDiscord,
  },
];

export default function OAuthSignIn() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {Providers.map((provider) => {
          const Icon = SVGIcons[provider.icon];
          return (
            <Button
              className="w-full m-2 outline-2"
              variant="outline"
              key={provider.name}
              onClick={() => {
                signIn(provider.icon);
              }}
            >
              <Icon className="w-12 mr-2 size-14" aria-hidden="true" />
              <p className=" text-md font-semibold">{provider.name}</p>
            </Button>
          );
        })}
      </div>
    </>
  );
}
