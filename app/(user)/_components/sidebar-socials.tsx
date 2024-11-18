import { SVGIcons } from '@/components/Icons';
import { Link2 } from 'lucide-react';
import Link from 'next/link';

type SidebarSocialLinksProps = Promise<{
  user: {
    socials: string[];
  };
}>;

type SocialMedia = ('twitter' | 'X') | 'discord' | 'instagram';

export default async function SidebarSocialLinks({
  props,
}: {
  props: SidebarSocialLinksProps;
}) {
  const { socials } = (await props).user;

  const getSocialMediaName = (url: string): SocialMedia | null => {
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return 'twitter';
    }
    if (url.includes('instagram.com')) {
      return 'instagram';
    }
    return null;
  };

  const icons = socials.map((url) => {
    const socialMedia = getSocialMediaName(url);
    switch (socialMedia) {
      case 'twitter':
        return 'X';
      case 'instagram':
        return 'instagram';
      default:
        return 'Unknown';
    }
  });
  return (
    <>
      {socials.length > 0 &&
        socials.map((url) => {
          return (
            <div className="flex flex-col mt-4 w-full p-2">
              <Link
                key={url}
                href={url}
                className="flex-row flex max-h-5 justify-start  "
              >
                {icons.map((icon, index) => {
                  if (icon !== 'Unknown') {
                    const Icon = SVGIcons[icon];
                    return <Icon key={index} className="w-2 h-2 " />;
                  } else {
                    return <Link2 key={index} className="w-2 h-2" />;
                  }
                })}
                <div className="font-extralight text-sm pl-2">
                  <p>{url.split('.com')[1]}</p>
                </div>
              </Link>
            </div>
          );
        })}
    </>
  );
}
