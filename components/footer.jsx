'use client';

import { Link } from "@heroui/link";
import SubscribeNewsletter from "./subscribeNewsletter";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2">
            <li>
              <Link href="mailto:contact@frenchpadelleague.com">
                📧 contact@frenchpadelleague.com
              </Link>
            </li>
            <li>
              <Link href="tel:++33698311099">
                📞 +33 6 98 31 10 99
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-1">
          <SubscribeNewsletter />
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} FPL by Guillot & Mathias. Tous droits réservés.
      </div>
    </footer>
  );
}
