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
  console.log("[v0] Starting PDF generation with data:", cvData)
  console.log("[v0] Selected template:", template)

  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    let yPosition = margin

    console.log("[v0] PDF document created, page width:", pageWidth)

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
        console.log("[v0] Adding profile photo to PDF")
        const photoSize = template === "minimal-with-photo" ? 20 : 30
        const photoX = template === "minimal-with-photo" ? pageWidth - margin - photoSize : margin
        const photoY = yPosition
        const radius = photoSize / 2
        const centerX = photoX + radius
        const centerY = photoY + radius

        doc.addImage(cvData.personalInfo.profilePhoto, "JPEG", photoX, photoY, photoSize, photoSize)

        if (template !== "minimal-with-photo") {
          nameStartX = margin + photoSize + 10
        }
        console.log("[v0] Profile photo added successfully")
      } catch (error) {
        console.log("[v0] Error adding profile photo to PDF:", error)
      }
    }

    // Name
    if (cvData.personalInfo.fullName) {
      console.log("[v0] Adding name:", cvData.personalInfo.fullName)
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
        nameStartX = margin
      } else {
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.text(cvData.personalInfo.fullName, nameStartX, yPosition + 15)
      }
      yPosition += 15
    }

    // Adjust yPosition to account for photo height
    if (cvData.personalInfo.profilePhoto && templatesWithPhoto.includes(template)) {
      yPosition = Math.max(yPosition, headerStartY + 35)
    }

    // Contact Information
    const contactInfo = []
    if (cvData.personalInfo.email) contactInfo.push(`Email: ${cvData.personalInfo.email}`)
    if (cvData.personalInfo.phone) contactInfo.push(`Phone: ${cvData.personalInfo.phone}`)
    if (cvData.personalInfo.location) contactInfo.push(`Location: ${cvData.personalInfo.location}`)

    if (contactInfo.length > 0) {
      console.log("[v0] Adding contact info:", contactInfo)
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

    // Header line
    if (cvData.personalInfo.fullName || contactInfo.length > 0) {
      doc.setDrawColor(5, 150, 105)
      if (template === "executive-no-photo") {
        doc.setLineWidth(2)
      } else {
        doc.setLineWidth(0.5)
      }
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 15
    }

    // Professional Summary
    if (cvData.personalInfo.summary) {
      console.log("[v0] Adding summary")
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
      console.log("[v0] Adding work experience, count:", cvData.experience.length)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Work Experience", margin, yPosition)
      yPosition += 8

      cvData.experience.forEach((exp, index) => {
        console.log("[v0] Adding experience", index + 1, ":", exp.position, "at", exp.company)

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
      console.log("[v0] Adding education, count:", cvData.education.length)

      // Check if we need a new page
      if (yPosition > 220) {
        doc.addPage()
        yPosition = margin
      }

      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Education", margin, yPosition)
      yPosition += 8

      cvData.education.forEach((edu, index) => {
        console.log("[v0] Adding education", index + 1, ":", edu.degree, "from", edu.institution)

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
      console.log("[v0] Adding skills, count:", cvData.skills.length)

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

    console.log("[v0] Saving PDF with filename:", fileName)

    // Save the PDF
    doc.save(fileName)

    console.log("[v0] PDF generation completed successfully")
  } catch (error) {
    console.error("[v0] Error generating PDF:", error)
    alert("Error generating PDF. Please check the console for details.")
  }
}
