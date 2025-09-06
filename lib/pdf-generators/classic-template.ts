import jsPDF from "jspdf"
import { type CVData, createPDFHelpers } from "./shared"

export function generateClassicPDF(cvData: CVData): void {
  const doc = new jsPDF()
  const helpers = createPDFHelpers(doc)
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Centered Name
  if (cvData.personalInfo.fullName) {
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    const textWidth = doc.getTextWidth(cvData.personalInfo.fullName)
    doc.text(cvData.personalInfo.fullName, (pageWidth - textWidth) / 2, yPosition + 15)
    yPosition += 15
  }

  // Centered Contact Information
  const contactInfo = []
  if (cvData.personalInfo.email) contactInfo.push(`Email: ${cvData.personalInfo.email}`)
  if (cvData.personalInfo.phone) contactInfo.push(`Phone: ${cvData.personalInfo.phone}`)
  if (cvData.personalInfo.location) contactInfo.push(`Location: ${cvData.personalInfo.location}`)

  if (contactInfo.length > 0) {
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const contactText = contactInfo.join(" | ")
    const textWidth = doc.getTextWidth(contactText)
    doc.text(contactText, (pageWidth - textWidth) / 2, yPosition)
    yPosition += 10
  }

  // Header line
  doc.setDrawColor(5, 150, 105)
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 15

  // Professional Summary (centered title)
  if (cvData.personalInfo.summary) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    const titleWidth = doc.getTextWidth("Professional Summary")
    doc.text("Professional Summary", (pageWidth - titleWidth) / 2, yPosition)
    yPosition += 8
    doc.setFont("helvetica", "normal")
    yPosition = helpers.addWrappedText(cvData.personalInfo.summary, margin, yPosition, contentWidth, 10)
    yPosition += 10
  }

  // Work Experience
  if (cvData.experience.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 30)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Work Experience", margin, yPosition)
    yPosition += 8

    cvData.experience.forEach((exp) => {
      yPosition = helpers.checkPageBreak(yPosition, 25)

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(exp.position || "Position Title", margin, yPosition)
      yPosition += 6

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const dateText = `${helpers.formatDate(exp.startDate)} - ${helpers.formatDate(exp.endDate)}`
      doc.text(exp.company || "Company Name", margin, yPosition)
      doc.text(dateText, pageWidth - margin - doc.getTextWidth(dateText), yPosition)
      yPosition += 6

      if (exp.description) {
        yPosition = helpers.addWrappedText(exp.description, margin, yPosition, contentWidth, 9)
      }
      yPosition += 8
    })
  }

  // Education
  if (cvData.education.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 30)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Education", margin, yPosition)
    yPosition += 8

    cvData.education.forEach((edu) => {
      yPosition = helpers.checkPageBreak(yPosition, 20)

      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      const degreeText = `${edu.degree || "Degree"}${edu.field ? ` in ${edu.field}` : ""}`
      doc.text(degreeText, margin, yPosition)
      yPosition += 6

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const yearText = edu.graduationYear || ""
      doc.text(edu.institution || "Institution Name", margin, yPosition)
      if (yearText) {
        doc.text(yearText, pageWidth - margin - doc.getTextWidth(yearText), yPosition)
      }
      yPosition += 8
    })
  }

  // Skills
  if (cvData.skills.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 20)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Skills", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const skillsText = cvData.skills.join(" • ")
    helpers.addWrappedText(skillsText, margin, yPosition, contentWidth, 10)
  }

  // Generate filename and save
  const fileName = cvData.personalInfo.fullName
    ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
    : "CV.pdf"

  doc.save(fileName)
}
