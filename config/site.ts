export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Découvrir la FPL",
      href: "/",
    },
    {
      label: "Mon Profil",
      href: "/profile",
    },
    {
      label: "Se Connecter",
      href: "/login",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
  },
};
