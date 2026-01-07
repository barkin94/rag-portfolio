import { cookies } from "next/headers";
import { Theme } from "../enums/theme";

const DEFAULT_THEME: Theme = Theme.Dark;

export const getThemeCookieInServer = async (): Promise<Theme> => {
    const themeCookie = (await cookies()).get('theme')?.value as Theme;
    
    return themeCookie ?? DEFAULT_THEME;
}