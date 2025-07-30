import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-primary/10 pb-20 sm:pb-6">
      <div className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pt-12 pb-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 border-b border-gray-500/30 pb-8">
          {/* Logo and Description */}
          <div className="w-full lg:w-1/3">
            <img className="h-8 sm:h-9" src={assets.logo} alt="GreenCart" />
            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              We deliver fresh groceries and snacks straight to your door.
              Trusted by thousands, we aim to make your shopping experience
              simple and affordable.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full lg:w-2/3">
            {footerLinks.map((section, index) => (
              <div key={index} className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-center text-sm text-gray-500">
          <p>
            Copyright © {new Date().getFullYear()} GreatStack.dev All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
