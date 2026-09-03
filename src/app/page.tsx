import { MusicProvider } from "@/context/MusicContext";
import EnvelopeIntro from "@/components/EnvelopeIntro";
import PetalsOverlay from "@/components/PetalsOverlay";
import SoundToggle from "@/components/SoundToggle";
import GaneshaCrest from "@/components/mural/GaneshaCrest";
import TemplePanHero from "@/components/mural/TemplePanHero";
import GatewayWall from "@/components/mural/GatewayWall";
import ArchInvitation from "@/components/mural/ArchInvitation";
import EventPillars from "@/components/mural/EventPillars";
import PillarFrame from "@/components/mural/PillarFrame";
import DateScratchReveal from "@/components/mural/DateScratchReveal";
import CountdownFinale from "@/components/mural/CountdownFinale";

export default function Home() {
  return (
    <MusicProvider>
      {/* revert to the video intro by swapping back to <IntroVideo /> */}
      <EnvelopeIntro />
      <PetalsOverlay />

      <main className="relative z-[1]">
        <GaneshaCrest />
        <TemplePanHero />
        <GatewayWall />
        {/* GarlandScene, StorySection, RsvpWhatsApp and GallerySection were
            removed from the flow (components kept on disk) — scratch-reveal
            date + countdown now sits between the invitation and the schedule */}
        <PillarFrame>
          <ArchInvitation />
          <DateScratchReveal />
          <EventPillars />
        </PillarFrame>
        <CountdownFinale />
      </main>

      <SoundToggle />
    </MusicProvider>
  );
}
