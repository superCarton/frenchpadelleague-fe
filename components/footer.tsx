"use client";

import NextLink from "next/link";
import { Link } from "@heroui/link";
import { Mail, Phone, Smartphone } from "lucide-react";

import SubscribeNewsletter from "./subscribeNewsletter";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto w-full">
        <div className="w-full flex flex-col lg:flex-row lg:justify-center lg:items-center gap-8">
          <div className="w-full lg:w-auto flex flex-col md:flex-row md:justify-center items-start md:items-start gap-8">
            <div className="w-full md:w-auto flex flex-col items-start text-left">
              <h3 className="text-lg font-semibold mb-3 uppercase">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link as={NextLink} className="text-white" href="/discover-fpl">
                    Découvrir la FPL
                  </Link>
                </li>
                {/* <li>
                  <Link as={NextLink} className="text-white" href="/discover-fpl">
                    La FPL côté clubs
                  </Link>
                </li>
                <li>
                  <Link as={NextLink} className="text-white" href="/faq">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link as={NextLink} className="text-white" href="/privacy-policy">
                    Politique de confidentialité
                  </Link>
                </li> */}
              </ul>
            </div>
            <div className="w-full md:w-auto flex flex-col items-start text-left">
              <h3 className="text-lg font-semibold mb-3 uppercase">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    isExternal
                    as={NextLink}
                    className="text-white flex align-center"
                    href="mailto:contact@frenchpadelleague.com"
                  >
                    <Mail className="mr-2" size={16} /> contact@frenchpadelleague.com
                  </Link>
                </li>
                <li>
                  <Link
                    isExternal
                    as={NextLink}
                    className="text-white flex align-center"
                    href="tel:+33698311099"
                  >
                    <Phone className="mr-2" size={16} /> +33 6 98 31 10 99
                  </Link>
                </li>
                <li>
                  <Link
                    isExternal
                    as={NextLink}
                    className="text-white flex align-center"
                    href="https://www.instagram.com/frenchpadelleague"
                  >
                    <Smartphone className="mr-2" size={16} /> Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full sm:max-w-xs mx-auto mt-8">
          <SubscribeNewsletter />
        </div>

        <div className="mt-10 border-t border-gray-700 pt-5 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} FPL by Guillot & Mathias. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
