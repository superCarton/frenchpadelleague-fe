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
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { ReactNode, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";

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

  const navItems: NavLink[] = [];

  if (!isConnected) {
    navItems.push(
      {
        label: "Découvrir la FPL",
        href: "/discover-fpl",
      },
      {
        label: "Tester mon niveau",
        href: "/test-level",
      }
    );
  }

  return (
    <HeroUINavbar className="bg-black text-white uppercase" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link className="flex justify-start items-center gap-1" color="primary" href="/">
            <Image height={40} src="/logo-transparent.svg" />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-0" justify="center">
        <div className="flex gap-4">
          <NavbarItem
            key="discover-fpl"
            as={Link}
            className="text-white text-small"
            href="/discover-fpl"
          >
            Découvrir la FPL
          </NavbarItem>
          <NavbarItem
            key="test-level"
            as={Link}
            className="text-white text-small"
            href="/test-level"
          >
            Tester mon niveau
          </NavbarItem>
        </div>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button as={Link} className="text-white bg-transparent" endContent={<ChevronDown />}>
                Rechercher
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem key="tournaments" as={Link} href="/tournaments">
              Une compétition
            </DropdownItem>
            <DropdownItem key="players" as={Link} href="/players">
              Un joueur
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarContent justify="end">
        {isConnected ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="RG"
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="user" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="profile">Mon profil</DropdownItem>
              <DropdownItem key="results">Mes résultats</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Se déconnecter
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button as={Link} className="" color="primary" href={"/login"} variant="solid">
            Se connecter
          </Button>
        )}
      </NavbarContent>
      <NavbarMenu className="bg-black text-white">
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
