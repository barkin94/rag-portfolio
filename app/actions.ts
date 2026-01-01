'use server';

import { cookies } from 'next/headers';

export async function setThemeCookie(isDark: boolean) {

  (await cookies()).set('isDark', isDark ? '1' : '0', {
    sameSite: 'lax',
    path: '/',
  });
}
