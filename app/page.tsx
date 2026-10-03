import Experience from "./_components/Experience";
import TechStack from "./_components/TechStack";
import Home from "./_components/Home";
import Footer from "./_components/Footer";
import ScrollUpButton from "@/common/components/ScrollUpButton";
import { getThemeCookieInServer } from "@/common/utils/cookie";
import MainHeader from "./_components/Header";
import Contact from "./_components/Contact";
import * as mongodb from "@/backend/shared/mongodb";

export default async function Main() {
  const theme = await getThemeCookieInServer();
  const resume = await mongodb.getResume();

  return (
    <div className="mx-auto">
      <MainHeader theme={theme} />
      <main>
        {resume ? (
          <>
            <Home summary={resume.summary} />
            <TechStack skills={resume.skills} />
            <Experience experience={resume.experience} />
            <Contact contact={resume.contact} />
          </>
        ) : (
          <Home 
            summary={{ location: '', summary: '', workPreferences: '' }} 
          />
        )}
      </main>
      <Footer />
      <ScrollUpButton />
    </div>
  )
}