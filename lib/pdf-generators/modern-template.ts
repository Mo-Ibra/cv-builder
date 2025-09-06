import jsPDF from "jspdf";
import { type CVData, createPDFHelpers } from "./shared";

export function generateModernPDF(cvData: CVData): void {
  const doc = new jsPDF();
  const helpers = createPDFHelpers(doc);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 20;
  const marginY = 20;
  const contentWidth = pageWidth - 2 * marginX;
  let yPosition = marginY;

  // Header with Profile Photo
  const headerStartY = yPosition;
  let nameStartX = marginX;

  if (cvData.personalInfo.profilePhoto) {
    try {
      const photoSize = 30;
      const photoX = marginX;
      const photoY = yPosition;
      doc.addImage(
        cvData.personalInfo.profilePhoto,
        "JPEG",
        photoX,
        photoY,
        photoSize,
        photoSize
      );
      nameStartX = marginX + photoSize + 10;
    } catch (error) {
      console.log("Error adding profile photo:", error);
    }
  }

  // Name
  if (cvData.personalInfo.fullName) {
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(cvData.personalInfo.fullName, nameStartX, yPosition + 12); // نزول بسيط من فوق
    yPosition += 15;
  }

  // Adjust for photo height
  if (cvData.personalInfo.profilePhoto) {
    yPosition = Math.max(yPosition, headerStartY + 35);
  }

  // Contact Information
  const contactInfo: string[] = [];
  if (cvData.personalInfo.email)
    contactInfo.push(`Email: ${cvData.personalInfo.email}`);
  if (cvData.personalInfo.phone)
    contactInfo.push(`Phone: ${cvData.personalInfo.phone}`);
  if (cvData.personalInfo.location)
    contactInfo.push(`Location: ${cvData.personalInfo.location}`);

  if (contactInfo.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(contactInfo.join(" | "), nameStartX, yPosition + 6);
    yPosition += 12;
  }

  // Header line
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.5);
  doc.line(marginX, yPosition, pageWidth - marginX, yPosition); // الخط جوه المارجن
  yPosition += 10;

  // Professional Summary
  if (cvData.personalInfo.summary) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Professional Summary", marginX, yPosition);
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    yPosition = helpers.addWrappedText(
      cvData.personalInfo.summary,
      marginX,
      yPosition,
      contentWidth,
      10
    );
    yPosition += 10;
  }

  // Work Experience
  if (cvData.experience.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Work Experience", marginX, yPosition);
    yPosition += 8;

    cvData.experience.forEach((exp) => {
      yPosition = helpers.checkPageBreak(yPosition, 25);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(exp.position || "Position Title", marginX, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const dateText = `${helpers.formatDate(
        exp.startDate
      )} - ${helpers.formatDate(exp.endDate)}`;
      doc.text(exp.company || "Company Name", marginX, yPosition);
      doc.text(
        dateText,
        pageWidth - marginX - doc.getTextWidth(dateText),
        yPosition
      );
      yPosition += 6;

      if (exp.description) {
        yPosition = helpers.addWrappedText(
          exp.description,
          marginX,
          yPosition,
          contentWidth,
          9
        );
      }
      yPosition += 8;
    });
  }

  // Education
  if (cvData.education.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Education", marginX, yPosition);
    yPosition += 8;

    cvData.education.forEach((edu) => {
      yPosition = helpers.checkPageBreak(yPosition, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const degreeText = `${edu.degree || "Degree"}${
        edu.field ? ` in ${edu.field}` : ""
      }`;
      doc.text(degreeText, marginX, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const yearText = edu.graduationYear || "";
      doc.text(edu.institution || "Institution Name", marginX, yPosition);
      if (yearText) {
        doc.text(
          yearText,
          pageWidth - marginX - doc.getTextWidth(yearText),
          yPosition
        );
      }
      yPosition += 8;
    });
  }

  // Skills
  if (cvData.skills.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Skills", marginX, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const skillsText = cvData.skills.join(" • ");
    helpers.addWrappedText(skillsText, marginX, yPosition, contentWidth, 10);
  }

  // Generate filename and save
  const fileName = cvData.personalInfo.fullName
    ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
    : "CV.pdf";

  doc.save(fileName);
}
