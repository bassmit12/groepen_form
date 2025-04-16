import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const contactInfo = {
    title: "Contact",
    icon: "🏢",
    content:
      "Industrieweg 54, 6651 KR Druten, Gelderland, Nederland\n+31 (0) 487 59 46 41\ninfo@groepen.nl",
  };

  const socialMedia = [
    {
      platform: "Facebook",
      link: "https://www.facebook.com/groepen.nl",
      icon: Facebook,
    },
    {
      platform: "Twitter",
      link: "https://twitter.com/groepen_nl",
      icon: Twitter,
    },
    {
      platform: "Instagram",
      link: "https://www.instagram.com/groepen.nl",
      icon: Instagram,
    },
  ];

  return (
    <footer className="bg-gray-100 mt-auto w-full">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center xl:text-left xl:grid-cols-3 xl:gap-8">
          <div className="mt-12 xl:mt-0">
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
              {contactInfo.title}
            </h3>
            <p className="mt-4 text-base text-gray-600 whitespace-pre-line">
              {contactInfo.content}
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex justify-center space-x-6">
            {socialMedia.map((item) => (
              <a
                key={item.platform}
                href={item.link}
                className="text-gray-600 hover:text-primary"
              >
                <span className="sr-only">{item.platform}</span>
                <item.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-center text-base text-gray-600">
            &copy; {new Date().getFullYear()} Groepen.nl. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
