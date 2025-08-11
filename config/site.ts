export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "French Padel League",
  description: "",
  links: {
  },
  passwordRegex: /^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[^A-Za-z0-9])\S{8,}$/, // 8 caracters min, 1 letter min, 1 number min, 1 special caracter min
};
