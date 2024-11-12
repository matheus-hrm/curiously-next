import { SVGIcons } from "@/components/Icons";
import { signInWithDiscord, signInWithGoogle } from "../signin/actions";
import { signIn } from "next-auth/react";

type OAuthProvider = {
    name: string;
    icon: keyof typeof SVGIcons;
    color: string;
    action: () => Promise<void>;
}[]

const Providers : OAuthProvider = 
[ 
  { 
    name: "Google",
    icon: "google",
    color: "bg-white",
    action: signInWithGoogle 
},{
    name: "Discord",
    icon: "discord",
    color: "bg-blue-600",
    action: signInWithDiscord,
  },
];

export default function OAuthSignIn() {
  return (
    <>
      <div className="flex flex-row justify-center items-center">
        {Providers.map((provider) => {
          const Icon = SVGIcons[provider.icon];
          return (
            <button
              className={`p-2 `}
              key={provider.name}
              onClick={() => { 
                signIn(provider.icon)
              }}
            >
              <Icon className="w-8 mr-2 size-10" aria-hidden="true" />
              <p>
                Sign in with {provider.name}
              </p>
            </button>
          );
        })}
      </div>
    </>
  );
}
