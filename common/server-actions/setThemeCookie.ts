'use server';

import { Theme, CookieName } from '@/common/enums';
import { cookies } from 'next/headers';

export async function setThemeCookie(theme: Theme) {
  (await cookies()).set(CookieName.THEME, theme, {
    sameSite: 'lax',
    path: '/',
  });
}
