import fieldImage from "@/assets/2026-Field-Balls.png";
import { FieldWorkspace } from "@/components/field-workspace";

export default function Home() {
  return <FieldWorkspace imageSrc={fieldImage.src} />;
}
