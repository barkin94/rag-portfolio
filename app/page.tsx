import Chat from "./_components/Chat/Chat";
import Profile from "./_components/Profile";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <header className="flex justify-between items-center py-6 mb-16"> */}
      {/*   <div className="text-2xl font-bold text-white">Portfolio</div> */}
      {/*   <nav className="hidden md:flex space-x-8"> */}
      {/*     <a href="/" className="text-white font-medium hover:text-blue-200 transition-colors">Home</a> */}
      {/*     <a href="/projects" className="text-white font-medium hover:text-blue-200 transition-colors">Projects</a> */}
      {/*     <a href="/chat" className="text-white font-medium hover:text-blue-200 transition-colors">Chat</a> */}
      {/*     <a href="/contact" className="text-white font-medium hover:text-blue-200 transition-colors">Contact</a> */}
      {/*   </nav> */}
      {/* </header> */}

      <main>
        <Profile />
        <Chat />
      </main>
    </div>

  )
}
