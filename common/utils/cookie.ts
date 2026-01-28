import { cookies } from "next/headers";
import { Theme, CookieName } from "../enums";

const DEFAULT_THEME: Theme = Theme.Dark;

export const getThemeCookieInServer = async (): Promise<Theme> => {
    const themeCookie = (await cookies()).get(CookieName.THEME)?.value as Theme;
    
    return themeCookie ?? DEFAULT_THEME;
}