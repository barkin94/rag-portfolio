"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { 
  type ISourceOptions, 
  MoveDirection, 
  OutMode 
} from "@tsparticles/engine"; 
import { loadSlim } from "@tsparticles/slim"; 

interface ParticleBackgroundProps {
  themeColor: string; // Accepts hex, rgb, or hsl strings
}

const ParticlesBackground: React.FC<ParticleBackgroundProps> = ({ themeColor }) => {
  const [init, setInit] = useState<boolean>(false);

  // Initialize the engine once per app lifecycle
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // useMemo prevents unnecessary re-calculations of the config object
  // unless the themeColor actually changes.
  const options: ISourceOptions = useMemo(() => ({
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "grab" },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.5 } },
        push: { quantity: 4 },
      },
    },
    particles: {
      color: { value: themeColor },
      links: {
        color: themeColor,
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: { default: OutMode.out },
        random: false,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: { enable: true },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }), [themeColor]);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 -z-10"
      options={options}
    />
  );
};

export default ParticlesBackground;