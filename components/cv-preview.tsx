import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
  profilePhoto?: string
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

interface CVPreviewProps {
  cvData: CVData
}

export function CVPreview({ cvData }: CVPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const hasContent =
    cvData.personalInfo.fullName ||
    cvData.personalInfo.email ||
    cvData.experience.length > 0 ||
    cvData.education.length > 0 ||
    cvData.skills.length > 0

  if (!hasContent) {
    return (
      <div className="bg-card rounded-lg p-8 min-h-[600px] flex items-center justify-center border">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg font-medium mb-2">Your CV Preview</p>
          <p className="text-muted-foreground text-sm">
            Start filling out the form to see your professional CV appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="p-8 space-y-6">
        {/* Header Section */}
        {(cvData.personalInfo.fullName || cvData.personalInfo.email) && (
          <div className="border-b pb-6">
            <div className="flex items-start gap-6 mb-4">
              {cvData.personalInfo.profilePhoto && (
                <img
                  src={cvData.personalInfo.profilePhoto || "/placeholder.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-border flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {cvData.personalInfo.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {cvData.personalInfo.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {cvData.personalInfo.email}
                    </div>
                  )}
                  {cvData.personalInfo.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {cvData.personalInfo.phone}
                    </div>
                  )}
                  {cvData.personalInfo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {cvData.personalInfo.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {cvData.personalInfo.summary && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Professional Summary</h2>
            <p className="text-card-foreground leading-relaxed">{cvData.personalInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {cvData.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Work Experience</h2>
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary/20 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{exp.position || "Position Title"}</h3>
                    {(exp.startDate || exp.endDate) && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-primary mb-2">{exp.company || "Company Name"}</p>
                  {exp.description && <p className="text-card-foreground text-sm leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Education</h2>
            <div className="space-y-3">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-secondary/20 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                    <h3 className="font-semibold text-foreground">
                      {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                    </h3>
                    {edu.graduationYear && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {edu.graduationYear}
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-secondary">{edu.institution || "Institution Name"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
