import Journey from "./_components/Journey";
import TechStack from "./_components/TechStack";
import Home from "./_components/Home";
import Footer from "./_components/Footer";
import ScrollUpButton from "@/common/components/ScrollUpButton";
import { getThemeCookieInServer } from "@/common/utils/cookie";
import MainHeader from "./_components/Header";

export default async function Main() { 
  const theme = await getThemeCookieInServer();

  return (
    <div className="mx-auto">
      <MainHeader theme={theme} />
      <main>
        <Home />
        <TechStack />
        <Journey />
      </main>
      <Footer />
      <ScrollUpButton />
    </div>
  )
}