import Chat from "./_components/Chat";
import Journey from "./_components/Journey";
import Header from "./_components/Header";
import TechStack from "./_components/TechStack";
import Home from "./_components/Home";
import ParticlesBackground from "./_components/ParticlesBackground";
import Footer from "./_components/Footer";

export default async function Main() { 
  return (
    <div className="mx-auto">
      <ParticlesBackground themeColor={'#3b82f6'} />
      <Header />
      <main>
        <Home />
        <TechStack />
        <Journey />
        <Chat />
      </main>
      <Footer />
    </div>
  )
}