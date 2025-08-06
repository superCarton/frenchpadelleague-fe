import { subtitle, title } from "@/components/primitives";

export default function ConfirmEmailLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Finalisez votre inscription</h1>
          <br />
          <div className={subtitle({ class: "mt-4" })}>
            Un e-mail vient de vous être envoyé.
          </div>
          {children}
        </div>
      </section>
    );
  }
  