import Journey from "./_components/Journey";
import Header from "./_components/Header";
import TechStack from "./_components/TechStack";
import Home from "./_components/Home";
import Footer from "./_components/Footer";
import ScrollUpButton from "@/common/components/ScrollUpButton";

export default async function Main() { 
  return (
    <div className="mx-auto">
      <Header />
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