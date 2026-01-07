import Chat from "../_components/Chat";
import WithFadeInAnimation from "../_components/UI/FadeInOnViewportEntry";

export default function AmaPage() {
  return (
    <WithFadeInAnimation>
      <Chat />
    </WithFadeInAnimation>
  );
}
