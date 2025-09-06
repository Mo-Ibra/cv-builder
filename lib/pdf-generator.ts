import type { CVData } from "@/lib/pdf-generators/shared";
import { generateModernPDF } from "@/lib/pdf-generators/modern-template";
import { generateClassicPDF } from "@/lib/pdf-generators/classic-template";
import { generateTechnicalPDF } from "@/lib/pdf-generators/technical-template";

export function generatePDF(
  cvData: CVData,
  template = "modern-with-photo"
): void {
  console.log("[v0] Starting PDF generation with template:", template);
  try {
    switch (template) {
      case "modern-with-photo":
      case "minimal-with-photo":
        generateModernPDF(cvData);
        break;
      case "classic-no-photo":
        generateClassicPDF(cvData);
        break;
      case "technical-resume":
        generateTechnicalPDF(cvData);
        break;
      case "executive-no-photo":
        generateClassicPDF(cvData); // Use classic for now
        break;
      case "creative-portfolio":
        generateModernPDF(cvData); // Use modern for now
        break;
      default:
        generateModernPDF(cvData);
    }

    console.log("[v0] PDF generation completed successfully");
  } catch (error) {
    console.error("[v0] Error generating PDF:", error);
    alert("Error generating PDF. Please check the console for details.");
  }
}
