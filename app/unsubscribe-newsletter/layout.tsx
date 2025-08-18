import { sectionTitle } from "@/components/primitives";

export default function UnSubscribeNewsletterLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className={sectionTitle()}>Désinscription de la newsletter</h1>
      <br />
      {children}
    </section>
  );
}
