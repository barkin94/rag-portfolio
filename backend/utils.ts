import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true, // Prevents client-side JS from accessing it (SECURE!)
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS,
  sameSite: "lax"
}

const USER_ID_COOKIE_KEY = 'user_id';

const getUserIdFromCookie = async () => {
  return (await cookies()).get(USER_ID_COOKIE_KEY)?.value
}

const setUserIdInCookie = async (userId: string) => {
    (await cookies()).set(USER_ID_COOKIE_KEY, userId, COOKIE_OPTIONS)
}

export default { getUserIdFromCookie, setUserIdInCookie }