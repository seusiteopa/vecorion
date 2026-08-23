import type { Metadata } from "next";
import FormularioWizard from "@/components/diagnostico/formulario/FormularioWizard";

export const metadata: Metadata = {
  alternates: { canonical: "/diagnostico/formulario" },
  title: "Conte-nos sobre o seu processo",
  description: "Não precisa conhecer tecnologia. Explique o problema com suas próprias palavras.",
  robots: { index: false, follow: false }, // fluxo de captação, sem valor de indexação
};

export default function FormularioPage() {
  return <FormularioWizard />;
}
