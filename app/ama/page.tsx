import WithFadeInAnimation from "@/common/components/FadeInOnViewportEntry";
import Chat from "./_components/Chat";

export default function AmaPage() {
  return (
    <WithFadeInAnimation>
      <Chat />
    </WithFadeInAnimation>
  );
}
