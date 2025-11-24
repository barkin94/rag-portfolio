import Chat from "./_components/Chat/Chat";
import Profile from "./_components/Profile";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        <Profile />
        <Chat />
      </main>
    </div>
  )
}
