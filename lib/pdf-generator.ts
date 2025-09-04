import jsPDF from "jspdf"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
  profilePhoto?: string // Added profilePhoto field to interface
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationYear: string
}

interface CVData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: string[]
}

export function generatePDF(cvData: CVData, template = "modern-with-photo"): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10): number => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + lines.length * fontSize * 0.4
  }

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  // Header Section with Profile Photo
  const headerStartY = yPosition
  let nameStartX = margin

  const templatesWithPhoto = ["modern-with-photo", "minimal-with-photo"]
  if (cvData.personalInfo.profilePhoto && templatesWithPhoto.includes(template)) {
    try {
      const photoSize = template === "minimal-with-photo" ? 20 : 30 // Smaller photo for minimal template
      const photoX = template === "minimal-with-photo" ? pageWidth - margin - photoSize : margin
      const photoY = yPosition
      const radius = photoSize / 2
      const centerX = photoX + radius
      const centerY = photoY + radius

      doc.saveGraphicsState()

      doc.circle(centerX, centerY, radius)
      doc.clip()

      doc.addImage(cvData.personalInfo.profilePhoto, "JPEG", photoX, photoY, photoSize, photoSize)

      doc.restoreGraphicsState()

      if (template !== "minimal-with-photo") {
        nameStartX = margin + photoSize + 10 // Adjust name position for modern template
      }
    } catch (error) {
      console.log("[v0] Error adding profile photo to PDF:", error)
    }
  }

  if (cvData.personalInfo.fullName) {
    if (template === "executive-no-photo") {
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text(cvData.personalInfo.fullName.toUpperCase(), nameStartX, yPosition + 15)
    } else if (template === "minimal-with-photo") {
      doc.setFontSize(18)
      doc.setFont("helvetica", "normal")
      doc.text(cvData.personalInfo.fullName, nameStartX, yPosition + 15)
    } else if (template === "classic-no-photo") {
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      const textWidth = doc.getTextWidth(cvData.personalInfo.fullName)
      doc.text(cvData.personalInfo.fullName, (pageWidth - textWidth) / 2, yPosition + 15)
      nameStartX = margin // Reset for contact info centering
    } else {
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(cvData.personalInfo.fullName, nameStartX, yPosition + 15)
    }
    yPosition += 15
  }

  // Adjust yPosition to account for photo height
  if (cvData.personalInfo.profilePhoto) {
    yPosition = Math.max(yPosition, headerStartY + 35) // Ensure we're below the photo
  }

  // Contact Information
  const contactInfo = []
  if (cvData.personalInfo.email) contactInfo.push(`Email: ${cvData.personalInfo.email}`)
  if (cvData.personalInfo.phone) contactInfo.push(`Phone: ${cvData.personalInfo.phone}`)
  if (cvData.personalInfo.location) contactInfo.push(`Location: ${cvData.personalInfo.location}`)

  if (contactInfo.length > 0) {
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    if (template === "classic-no-photo") {
      const contactText = contactInfo.join(" | ")
      const textWidth = doc.getTextWidth(contactText)
      doc.text(contactText, (pageWidth - textWidth) / 2, yPosition)
    } else {
      doc.text(contactInfo.join(" | "), nameStartX, yPosition)
    }
    yPosition += 10
  }

  if (cvData.personalInfo.fullName || contactInfo.length > 0) {
    doc.setDrawColor(5, 150, 105)
    if (template === "executive-no-photo") {
      doc.setLineWidth(2) // Thicker line for executive template
    } else {
      doc.setLineWidth(0.5)
    }
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 15
  }

  // Professional Summary
  if (cvData.personalInfo.summary) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")

    const summaryTitle =
      template === "executive-no-photo"
        ? "EXECUTIVE SUMMARY"
        : template === "minimal-with-photo"
          ? "SUMMARY"
          : "Professional Summary"

    if (template === "classic-no-photo") {
      const titleWidth = doc.getTextWidth(summaryTitle)
      doc.text(summaryTitle, (pageWidth - titleWidth) / 2, yPosition)
    } else {
      doc.text(summaryTitle, margin, yPosition)
    }
    yPosition += 8

    doc.setFont("helvetica", "normal")
    yPosition = addWrappedText(cvData.personalInfo.summary, margin, yPosition, contentWidth, 10)
    yPosition += 10
  }

  // Work Experience
  if (cvData.experience.length > 0) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Work Experience", margin, yPosition)
    yPosition += 8

    cvData.experience.forEach((exp) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = margin
      }

      // Position and Company
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      const positionText = exp.position || "Position Title"
      doc.text(positionText, margin, yPosition)
      yPosition += 6

      // Company and Date
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const companyText = exp.company || "Company Name"
      const dateText = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
      doc.text(companyText, margin, yPosition)
      doc.text(dateText, pageWidth - margin - doc.getTextWidth(dateText), yPosition)
      yPosition += 6

      // Description
      if (exp.description) {
        yPosition = addWrappedText(exp.description, margin, yPosition, contentWidth, 9)
      }
      yPosition += 8
    })
  }

  // Education
  if (cvData.education.length > 0) {
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage()
      yPosition = margin
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Education", margin, yPosition)
    yPosition += 8

    cvData.education.forEach((edu) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = margin
      }

      // Degree and Field
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      const degreeText = `${edu.degree || "Degree"}${edu.field ? ` in ${edu.field}` : ""}`
      doc.text(degreeText, margin, yPosition)
      yPosition += 6

      // Institution and Year
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const institutionText = edu.institution || "Institution Name"
      const yearText = edu.graduationYear || ""
      doc.text(institutionText, margin, yPosition)
      if (yearText) {
        doc.text(yearText, pageWidth - margin - doc.getTextWidth(yearText), yPosition)
      }
      yPosition += 8
    })
  }

  // Skills
  if (cvData.skills.length > 0) {
    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage()
      yPosition = margin
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Skills", margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const skillsText = cvData.skills.join(" • ")
    yPosition = addWrappedText(skillsText, margin, yPosition, contentWidth, 10)
  }

  // Generate filename
  const fileName = cvData.personalInfo.fullName
    ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
    : "CV.pdf"

  // Save the PDF
  doc.save(fileName)
}
