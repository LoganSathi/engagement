import ArtSlot from "./ArtSlot";
import ChimeTrigger from "@/components/ChimeTrigger";

/**
 * S3 — marigold-garlanded wall with the pastel gateway arch. The arch
 * opening in the final art is transparent, so the gradient layer behind it
 * (wall-cream → invite-cream) is what guests see "through" the gate — it
 * hands the eye to the invitation section below.
 */
export default function GatewayWall() {
  return (
    <section className="relative -mt-px bg-[var(--wall-cream)]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--wall-cream), var(--invite-cream))",
        }}
      />
      <ChimeTrigger kind="whoosh" />
      <ArtSlot slot="gatewayWall" />
    </section>
  );
}
