"use client";

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
import { Button } from "@heroui/button";
import { ReactNode, useEffect, useState } from "react";
import { ShieldUser } from "lucide-react";

import { isUserConnected } from "@/lib/api";

type NavLink = {
  label: string | ReactNode;
  href: string;
  isButton?: boolean;
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // On vérifie seulement côté client
  useEffect(() => {
    setIsConnected(isUserConnected());
  }, []);

  const navItems: NavLink[] = [
    {
      label: "Rechercher un joueur",
      href: "/players",
    },
    {
      label: "Rechercher un tournoi",
      href: "/tournaments",
    },
  ];

  if (isConnected) {
    navItems.push({
      label: (
        <div className="inline-block">
          <ShieldUser />
          Mon Profil
        </div>
      ),
      href: "/profile",
    });
  } else {
    navItems.push(
      {
        label: "Découvrir la FPL",
        href: "/discover-fpl",
      },
      {
        label: "Tester mon niveau",
        href: "/test-level",
      },
      {
        label: "Se Connecter",
        href: "/login",
        isButton: true,
      }
    );
  }

  return (
    <HeroUINavbar
      className="bg-black text-white uppercase"
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand>
        <NextLink className="flex justify-start items-center gap-1" color="primary" href="/">
          <Image src="/logo-transparent.svg" width={30} />
        </NextLink>
      </NavbarBrand>
      <NavbarContent justify="end">
        {navItems.map((item) => (
          <NavbarItem key={item.href} className="hidden sm:flex gap-4">
            {item.isButton ? (
              <Button as={Link} className="" color="primary" href={item.href} variant="solid">
                {item.label}
              </Button>
            ) : (
              <NextLink
                className={clsx(
                  "text-white",
                  "data-[active=true]:primary data-[active=true]:font-medium"
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
            <Link href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
