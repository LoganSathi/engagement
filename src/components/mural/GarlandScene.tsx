import ArtSlot from "./ArtSlot";

/**
 * S6+S7 — full-bleed couple garland-exchange scene; the lotus stage and the
 * fade to maroon are baked into the artwork's bottom edge.
 */
export default function GarlandScene() {
  return (
    <section className="relative -mt-px bg-[var(--sky-haze)]">
      <ArtSlot slot="garlandScene" />
    </section>
  );
}
