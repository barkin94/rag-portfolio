import Chat from "./_components/Chat";
import { Message } from "./_components/Chat/Messages";
import Journey from "./_components/Journey";
import Header from "./_components/Header";
import Info from "./_components/Info";
import About from "./_components/About";
import TechStack from "./_components/TechStack";

export default async function Home() {
  const initialMessages: Message[] = []
 
  return (
    <div className="mx-auto">
      <Header />
      <main>
        <Info />
        <div className='mb-6 lg:mb-8'></div>
        <About/>
        <div className="mb-6 lg:mb-8"></div>
        <TechStack />
        <Journey />

        <Chat initialMessages={initialMessages}/>

      </main>
    </div>
  )
}