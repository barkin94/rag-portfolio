import Experience from "./_components/Experience";
import TechStack from "./_components/TechStack";
import Home from "./_components/Home";
import About from "./_components/About";
import Footer from "./_components/Footer";
import ScrollUpButton from "@/common/components/ScrollUpButton";
import { getThemeCookieInServer } from "@/common/utils/cookie";
import MainHeader from "./_components/Header";
import Contact from "./_components/Contact";
import * as cvRepo from "@/backend/features/cv-sync/repository";
import config from "@/backend/shared/config";

export default async function Main() {
  const theme = await getThemeCookieInServer();
  const resume = await cvRepo.getResume();

  const profileImageUrl = config.PROFILE_IMAGE_URL ?? "https://media.licdn.com/dms/image/v2/D4D03AQF5sKUJ7GEIhA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727656649171?e=1793232000&v=beta&t=TQim6diFwaGpIjbO5fHuElgF02CZlf0x2rSahf0Pf1k";

  return (
    <div className="mx-auto">
      <MainHeader theme={theme} />
      <main>
        {resume ? (
          <>
            <Home />
            <About summary={resume.summary} imageSrc={profileImageUrl} />
            <TechStack skills={resume.skills} />
            <Experience experience={resume.experience} />
            <Contact contact={resume.contact} />
          </>
        ) : (
          <p>An error occurred while fetching the resume data.</p>
        )}
      </main>
      <Footer />
      <ScrollUpButton />
    </div>
  )
}