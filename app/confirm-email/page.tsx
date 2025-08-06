'use client';

import { Link } from '@heroui/link';

export default function ConfirmEmailPage() {
  const resendEmail = async (e: any) => {
    e.preventDefault();
    console.log('resendEmail')
  };
  return (
    <div>
      <div>Pour finaliser votre inscription, rendez-vous dans votre boite email pour activer votre compte.</div>
      <div>Pas d'email reçu dans votre boite de réception ou vos spams ?</div>
      <div><Link onPress={resendEmail}>Renvoyer l'email</Link></div>
      <div>Si vous avez procédé à la vérification, <Link href="/login">cliquez ici</Link> pour continuer votre navigation.</div>
    </div>
  );
}
