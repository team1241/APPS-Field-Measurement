import Image from "next/image";
import theoryLogo from "@/assets/theory-round.webp";

export const HeaderBrand = () => (
  <div className="flex min-w-0 items-center gap-2.5">
    <Image
      alt="Theory6 logo"
      className="size-9 shrink-0 rounded-full"
      height={36}
      priority
      src={theoryLogo}
      width={36}
    />
    <span className="truncate font-bold font-brand text-base text-slate-900 tracking-tight sm:text-lg">
      Field Measurement
    </span>
  </div>
);
