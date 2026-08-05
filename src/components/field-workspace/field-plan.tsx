import Image from "next/image";

interface FieldPlanProps {
  imageSrc: string;
}

export const FieldPlan = ({ imageSrc }: FieldPlanProps) => (
  <section
    aria-label="Field plan workspace"
    className="relative min-h-0 flex-1 overflow-hidden"
  >
    <div className="relative h-full w-full">
      <Image
        alt="2026 field layout"
        className="object-contain p-3 sm:p-6 lg:p-8"
        fill
        priority
        sizes="100vw"
        src={imageSrc}
      />
    </div>
  </section>
);
