import { sectionTitle } from "@/components/primitives";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={sectionTitle()}>Mon Profil</h1>
        {children}
      </div>
    </section>
  );
}
