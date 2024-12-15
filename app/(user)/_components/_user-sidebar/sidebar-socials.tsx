import { SVGIcons } from '@/components/Icons';
import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

type SidebarSocialLinksProps = {
  socials: string[];
};

type SocialMedia = 'X' | 'discord' | 'instagram';

const getSocialMediaName = (url: string): SocialMedia | 'Unknown' => {
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return 'X';
  }
  if (url.includes('instagram.com')) {
    return 'instagram';
  }
  return 'Unknown';
};

export default function SidebarSocialLinks({
  props,
}: {
  props: SidebarSocialLinksProps;
}) {
  const socials = props.socials;

  const icons = socials.map((url) => ({
    url,
    type: getSocialMediaName(url),
  }));

  return (
    <>
      {icons.length > 0 &&
        icons.map(({ url, type }, i) => {
          const Icon = type !== 'Unknown' ? SVGIcons[type] : LinkIcon;
          return (
            <div key={url} className="flex flex-col w-full p-2 ">
              <Link
                key={url}
                href={url}
                className="flex-row flex max-h-5 justify-start "
              >
                <Icon key={i} className="w-5 h-5" />
                <div className="font-extralight text-sm pl-2 hover:underline">
                  <p className="text-blue-400 hover:decoration-blue-400 hover:underline">
                    {url.includes('.com/')
                      ? url.split('.com/')[1]
                      : url.replaceAll('https://', '')}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
    </>
  );
}
