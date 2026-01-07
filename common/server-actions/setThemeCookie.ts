'use server';

import { Theme } from '@/common/enums/theme';
import { cookies } from 'next/headers';

export async function setThemeCookie(theme: Theme) {
  (await cookies()).set('theme', theme, {
    sameSite: 'lax',
    path: '/',
  });
}
