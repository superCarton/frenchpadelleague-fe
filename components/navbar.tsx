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
import NextLink from "next/link";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/store";

type NavLink = {
  label: string | ReactNode;
  href: string;
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, logout } = useUserStore();
  const router = useRouter();

  const navItems: NavLink[] = [];

  if (!profile) {
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
          <Link as={NextLink} className="flex justify-start items-center gap-1" href="/">
            <Image height={40} src="/logo-transparent.svg" />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-0" justify="center">
        <div className="flex gap-4">
          <NavbarItem key="discover-fpl" className="text-white text-small">
            <Link as={NextLink} className="text-white" href="/discover-fpl">
              Découvrir la FPL
            </Link>
          </NavbarItem>
          <NavbarItem key="test-level" className="text-white text-small">
            <Link as={NextLink} className="text-white" href="/test-level">
              Tester mon niveau
            </Link>
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
            <DropdownItem key="tournaments">
              <Link as={NextLink} href="/tournaments">
                Une compétition
              </Link>
            </DropdownItem>
            <DropdownItem key="players">
              <Link as={NextLink} href="/players">
                Un joueur
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarContent justify="end">
        {profile ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className={`transition-transform border-2 border-${profile.league?.badge}`}
                name="RG"
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                onPress={() => router.push(`/players/${profile.documentId}`)}
              >
                <p className="font-semibold">
                  {profile.firstname} {profile.lastname}
                </p>
              </DropdownItem>
              <DropdownItem key="results">Mes résultats</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => {
                  logout();
                  router.push("/");
                }}
              >
                Se déconnecter
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button color="primary" variant="solid" onPress={() => router.push("/login")}>
            Se connecter
          </Button>
        )}
      </NavbarContent>
      <NavbarMenu className="bg-black text-white">
        {navItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link as={NextLink} href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
