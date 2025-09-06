import jsPDF from "jspdf"
import { type CVData, createPDFHelpers } from "./shared"

export function generateTechnicalPDF(cvData: CVData): void {
  const doc = new jsPDF()
  const helpers = createPDFHelpers(doc)
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Technical style header
  doc.setFontSize(10)
  doc.setFont("courier", "normal")
  doc.text("// Technical Resume", margin, yPosition)
  yPosition += 8

  // Name in monospace
  if (cvData.personalInfo.fullName) {
    doc.setFontSize(20)
    doc.setFont("courier", "bold")
    doc.text(cvData.personalInfo.fullName.toUpperCase(), margin, yPosition + 15)
    yPosition += 20
  }

  // Contact Information
  const contactInfo = []
  if (cvData.personalInfo.email) contactInfo.push(`email: ${cvData.personalInfo.email}`)
  if (cvData.personalInfo.phone) contactInfo.push(`phone: ${cvData.personalInfo.phone}`)
  if (cvData.personalInfo.location) contactInfo.push(`location: ${cvData.personalInfo.location}`)

  if (contactInfo.length > 0) {
    doc.setFontSize(9)
    doc.setFont("courier", "normal")
    contactInfo.forEach((info) => {
      doc.text(`// ${info}`, margin, yPosition)
      yPosition += 6
    })
    yPosition += 5
  }

  // Header separator
  doc.setDrawColor(100, 100, 100)
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 15

  // Professional Summary
  if (cvData.personalInfo.summary) {
    doc.setFontSize(12)
    doc.setFont("courier", "bold")
    doc.text("/* SUMMARY */", margin, yPosition)
    yPosition += 8
    doc.setFontSize(9)
    doc.setFont("courier", "normal")
    yPosition = helpers.addWrappedText(cvData.personalInfo.summary, margin, yPosition, contentWidth, 9)
    yPosition += 10
  }

  // Skills (prioritized for technical roles)
  if (cvData.skills.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 30)
    doc.setFontSize(12)
    doc.setFont("courier", "bold")
    doc.text("/* TECHNICAL SKILLS */", margin, yPosition)
    yPosition += 8

    doc.setFontSize(9)
    doc.setFont("courier", "normal")
    cvData.skills.forEach((skill, index) => {
      const skillText = `  - ${skill}`
      doc.text(skillText, margin, yPosition)
      yPosition += 6
      if ((index + 1) % 10 === 0) {
        // Page break every 10 skills
        yPosition = helpers.checkPageBreak(yPosition, 20)
      }
    })
    yPosition += 10
  }

  // Work Experience
  if (cvData.experience.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 30)
    doc.setFontSize(12)
    doc.setFont("courier", "bold")
    doc.text("/* EXPERIENCE */", margin, yPosition)
    yPosition += 8

    cvData.experience.forEach((exp) => {
      yPosition = helpers.checkPageBreak(yPosition, 30)

      doc.setFontSize(10)
      doc.setFont("courier", "bold")
      doc.text(`${exp.position || "Position"} @ ${exp.company || "Company"}`, margin, yPosition)
      yPosition += 6

      doc.setFontSize(8)
      doc.setFont("courier", "normal")
      const dateText = `// ${helpers.formatDate(exp.startDate)} - ${helpers.formatDate(exp.endDate)}`
      doc.text(dateText, margin, yPosition)
      yPosition += 6

      if (exp.description) {
        doc.setFontSize(9)
        yPosition = helpers.addWrappedText(exp.description, margin + 10, yPosition, contentWidth - 10, 9)
      }
      yPosition += 10
    })
  }

  // Education
  if (cvData.education.length > 0) {
    yPosition = helpers.checkPageBreak(yPosition, 30)
    doc.setFontSize(12)
    doc.setFont("courier", "bold")
    doc.text("/* EDUCATION */", margin, yPosition)
    yPosition += 8

    cvData.education.forEach((edu) => {
      yPosition = helpers.checkPageBreak(yPosition, 20)

      doc.setFontSize(10)
      doc.setFont("courier", "bold")
      const degreeText = `${edu.degree || "Degree"}${edu.field ? ` in ${edu.field}` : ""}`
      doc.text(degreeText, margin, yPosition)
      yPosition += 6

      doc.setFontSize(9)
      doc.setFont("courier", "normal")
      const yearText = edu.graduationYear ? ` // ${edu.graduationYear}` : ""
      doc.text(`${edu.institution || "Institution"}${yearText}`, margin, yPosition)
      yPosition += 8
    })
  }

  // Generate filename and save
  const fileName = cvData.personalInfo.fullName
    ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_Technical_Resume.pdf`
    : "Technical_Resume.pdf"

  doc.save(fileName)
}
