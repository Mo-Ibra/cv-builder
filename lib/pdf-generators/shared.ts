import type jsPDF from "jspdf";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  profilePhoto?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface PDFHelpers {
  addWrappedText: (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize?: number
  ) => number;
  formatDate: (dateString: string) => string;
  checkPageBreak: (yPosition: number, requiredSpace: number) => number;
}

export function createPDFHelpers(doc: jsPDF): PDFHelpers {
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  return {
    addWrappedText: (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      fontSize = 10
    ): number => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + lines.length * fontSize * 0.4;
    },

    formatDate: (dateString: string): string => {
      if (!dateString) return "Present";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    },

    checkPageBreak: (yPosition: number, requiredSpace: number): number => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        return margin;
      }
      return yPosition;
    },
  };
}
