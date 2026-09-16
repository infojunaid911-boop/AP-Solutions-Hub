"use client";

import { SectionCopy, SplitBlock } from "./Scene";
import { NetworkVisual } from "./visuals";

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="bg-paper py-24 md:py-32">
      <SplitBlock
        invert
        visual={<NetworkVisual />}
      >
        <SectionCopy index="01" title="Who We Are">
          <p>
            AP Solutions Hub is a team that keeps design and development in
            the same room. Everything a business needs to launch, grow, and
            stand out — websites, dashboards, marketing, branding, 3D
            visualization — sits under one roof, handled by people who
            actually build it, not a chain of subcontractors.
          </p>
          <p className="mt-4">
            We build digital solutions that help businesses grow: look
            better, work smarter, and show up with a presence that feels
            intentional.
          </p>
        </SectionCopy>
      </SplitBlock>
    </section>
  );
}
