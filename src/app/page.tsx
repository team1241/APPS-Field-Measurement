import Image from "next/image";

import fieldImage from "@/assets/2026-Field-Balls.png";

export default function Home() {
  return (
    <main className="relative h-dvh w-screen">
      <Image
        alt="2026 field layout"
        className="object-contain"
        fill
        priority
        sizes="100vw"
        src={fieldImage}
      />
    </main>
  );
}
