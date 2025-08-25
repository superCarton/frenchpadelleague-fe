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

  const navItems: NavLink[] = [
    { label: "Découvrir la FPL", href: "/discover-fpl" },
    // { label: "Tester mon niveau", href: "/test-level" },
    { label: "Rechercher une compétition", href: "/tournaments" },
    { label: "Rechercher un club", href: "/clubs" },
    { label: "Rechercher un joueur", href: "/players" },
  ];

  return (
    <HeroUINavbar
      className="bg-black text-white uppercase"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left */}
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

      {/* Center */}
      <NavbarContent className="hidden sm:flex gap-0" justify="center">
        <div className="flex gap-4">
          <NavbarItem key="discover-fpl">
            <Link as={NextLink} className="text-white" href="/discover-fpl">
              Découvrir la FPL
            </Link>
          </NavbarItem>
          {/* <NavbarItem key="test-level">
            <Link as={NextLink} className="text-white" href="/test-level">
              Tester mon niveau
            </Link>
          </NavbarItem> */}
        </div>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                as={Link}
                className="text-white bg-transparent text-medium"
                endContent={<ChevronDown />}
              >
                Rechercher
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu itemClasses={{ base: "gap-4" }}>
            <DropdownItem key="tournaments">
              <Link as={NextLink} className="text-black" href="/tournaments">
                Une compétition
              </Link>
            </DropdownItem>
            <DropdownItem key="clubs">
              <Link as={NextLink} className="text-black" href="/clubs">
                Un club
              </Link>
            </DropdownItem>
            <DropdownItem key="players">
              <Link as={NextLink} className="text-black" href="/players">
                Un joueur
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Right */}
      <NavbarContent justify="end">
        {profile ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className={`transition-transform border-2 border-${profile.league.badge}`}
                name={`${profile.firstname.at(0)}${profile.lastname.at(0)}`}
                size="md"
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

      {/* Mobile menu */}
      <NavbarMenu className="bg-black text-white pt-6 flex flex-col gap-6">
        {navItems.map((item, index) => (
          <NavbarMenuItem
            key={item.href}
            // className={`opacity-0 translate-y-4 animate-fade-slide-in`}
            // style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
          >
            <Link
              as={NextLink}
              className="text-white text-xl"
              href={item.href}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
