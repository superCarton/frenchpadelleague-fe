const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

console.log('API_URL', API_URL)
export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
}

export function getCurrentUser(): any | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: email,
      password,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Erreur login');
  localStorage.setItem('jwt', data.jwt);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}

export async function getMeProfiles() {
  const token = getToken();
  if (!token) throw new Error('Utilisateur non authentifié');

  const res = await fetch(`${API_URL}/me/profiles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Erreur /me/profiles');
  return data;
}

export async function createPlayer(payload: any) {
  const res = await fetch(`${API_URL}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Erreur création joueur');
  localStorage.setItem('jwt', data.jwt);
  return data;
}

export async function subscribeNewsletter(payload: any) {
  const res = await fetch(`${API_URL}/newsletters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Erreur lors de l\'ajout à la newsletter');
  return data;
}

export async function unsubscribeNewsletter(token: string) {
  const res = await fetch(`${API_URL}/newsletters/unknown?token=${token}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Erreur lors de la suppression de la newsletter');
  return data;
}