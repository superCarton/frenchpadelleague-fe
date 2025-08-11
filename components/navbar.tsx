'use client';

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import clsx from "clsx";
import { Image } from "@heroui/image";

import { isUserConnected } from "@/lib/api";
import { Button } from "@heroui/button";
import { useState } from "react";

type NavLink = {
  label: string;
  href: string;
  isButton?: boolean;
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  let navItems: NavLink[] = [];
  if (isUserConnected()) {
    navItems = [
      {
        label: "Rechercher un tournoi",
        href: "/",
      },
      {
        label: "Mon Profil",
        href: "/profile",
      },
    ];
  } else {
    navItems = [
      {
        label: "Découvrir la FPL",
        href: "/discover-fpl",
      },
      {
        label: "Tester mon niveau",
        href: "/",
      },
      {
        label: "Se Connecter",
        href: "/login",
        isButton: true
      },
    ];
  }
  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="bg-black text-white uppercase" onMenuOpenChange={setIsMenuOpen}>
      <NavbarBrand>
        <NextLink className="flex justify-start items-center gap-1" href="/" color="primary">
          <Image src="/logo-transparent.svg" width={30} />
        </NextLink>
      </NavbarBrand>
      <NavbarContent justify="end">
        {navItems.map((item) => (
          <NavbarItem key={item.href} className="hidden sm:flex gap-4">
            {item.isButton ? (
              <Button as={Link} href={item.href} className="" variant="solid" color="primary">
                {item.label}
              </Button>
            ) : (
              <NextLink
                className={clsx(
                  "text-white",
                  "data-[active=true]:primary data-[active=true]:font-medium",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            )}
          </NavbarItem>
        ))}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarMenu>
        {navItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
