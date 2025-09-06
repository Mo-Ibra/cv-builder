"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Briefcase, GraduationCap, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Template {
  id: string
  name: string
  description: string
  features: string[]
  hasPhoto: boolean
  style: "modern" | "classic" | "minimal"
  preview: React.ReactNode
}

const templates: Template[] = [
  {
    id: "modern-with-photo",
    name: "Modern Professional",
    description: "Contemporary design with profile photo and clean layout",
    features: ["Profile Photo", "Modern Typography", "Color Accents", "Skills Badges"],
    hasPhoto: true,
    style: "modern",
    preview: (
      <div className="bg-white p-4 rounded border text-xs space-y-2">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-accent rounded-full flex-shrink-0"></div>
          <div>
            <div className="h-2 bg-foreground rounded w-16 mb-1"></div>
            <div className="h-1 bg-muted-foreground rounded w-12"></div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1 bg-muted-foreground rounded w-full"></div>
          <div className="h-1 bg-muted-foreground rounded w-3/4"></div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground rounded w-12"></div>
          <div className="h-1 bg-muted-foreground rounded w-full"></div>
        </div>
      </div>
    ),
  },
  {
    id: "classic-no-photo",
    name: "Classic Professional",
    description: "Traditional layout without photo, perfect for conservative industries",
    features: ["No Photo", "Traditional Layout", "Professional Typography", "Clean Structure"],
    hasPhoto: false,
    style: "classic",
    preview: (
      <div className="bg-white p-4 rounded border text-xs space-y-2">
        <div className="text-center space-y-1">
          <div className="h-2 bg-foreground rounded w-20 mx-auto"></div>
          <div className="h-1 bg-muted-foreground rounded w-16 mx-auto"></div>
        </div>
        <div className="space-y-1">
          <div className="h-1 bg-muted-foreground rounded w-full"></div>
          <div className="h-1 bg-muted-foreground rounded w-3/4"></div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground rounded w-12"></div>
          <div className="h-1 bg-muted-foreground rounded w-full"></div>
        </div>
      </div>
    ),
  },
  {
    id: "minimal-with-photo",
    name: "Minimal Creative",
    description: "Clean, minimal design with subtle photo integration",
    features: ["Subtle Photo", "Minimal Design", "Creative Layout", "Focus on Content"],
    hasPhoto: true,
    style: "minimal",
    preview: (
      <div className="bg-white p-4 rounded border text-xs space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="h-2 bg-foreground rounded w-16"></div>
            <div className="h-1 bg-muted-foreground rounded w-12"></div>
          </div>
          <div className="w-6 h-6 bg-muted rounded-full"></div>
        </div>
        <div className="space-y-1">
          <div className="h-1 bg-muted-foreground rounded w-full"></div>
          <div className="h-1 bg-muted-foreground rounded w-2/3"></div>
        </div>
      </div>
    ),
  },
  {
    id: "executive-no-photo",
    name: "Executive Summary",
    description: "Professional executive-style layout focusing on achievements",
    features: ["No Photo", "Executive Style", "Achievement Focus", "Premium Typography"],
    hasPhoto: false,
    style: "classic",
    preview: (
      <div className="bg-white p-4 rounded border text-xs space-y-2">
        <div className="border-b border-muted pb-2">
          <div className="h-2 bg-foreground rounded w-18 mb-1"></div>
          <div className="h-1 bg-muted-foreground rounded w-14"></div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground rounded w-16"></div>
          <div className="h-1 bg-muted-foreground rounded w-full"></div>
          <div className="h-1 bg-muted-foreground rounded w-4/5"></div>
        </div>
      </div>
    ),
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    description: "Bold design for creative professionals with visual emphasis",
    features: ["Large Photo", "Creative Layout", "Portfolio Focus", "Visual Impact"],
    hasPhoto: true,
    style: "modern",
    preview: (
      <div className="bg-white p-4 rounded border text-xs space-y-2">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 bg-accent rounded-lg"></div>
          <div className="space-y-1">
            <div className="h-2 bg-foreground rounded w-16 mx-auto"></div>
            <div className="h-1 bg-muted-foreground rounded w-12 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="h-1 bg-muted-foreground rounded"></div>
          <div className="h-1 bg-muted-foreground rounded"></div>
        </div>
      </div>
    ),
  },
  {
    id: "technical-resume",
    name: "Technical Professional",
    description: "Clean layout optimized for developers and technical roles",
    features: ["No Photo", "Skills Matrix", "Project Focus", "Technical Layout"],
    hasPhoto: false,
    style: "minimal",
    preview: (
      <div className="bg-white p-4 rounded border text-xs space-y-2">
        <div className="space-y-1">
          <div className="h-2 bg-foreground rounded w-16"></div>
          <div className="h-1 bg-muted-foreground rounded w-12"></div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="h-1 bg-accent rounded"></div>
          <div className="h-1 bg-accent rounded"></div>
          <div className="h-1 bg-accent rounded"></div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-foreground rounded w-12"></div>
          <div className="h-1 bg-muted-foreground rounded w-full"></div>
        </div>
      </div>
    ),
  },
]

export default function TemplateSelection() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8" />
              <h1 className="text-2xl font-bold">CV Builder Pro</h1>
            </div>
            <Button variant="secondary" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Choose Your Perfect CV Template
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Select from our professionally designed templates to create a standout resume that gets you noticed by
            employers.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              Professional Templates
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-accent" />
              Industry Optimized
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-accent" />
              ATS Friendly
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
              All Templates
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
              With Photo
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
              Without Photo
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
              Modern
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
              Classic
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
              Minimal
            </Badge>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{template.description}</p>
                    </div>
                    <Badge variant={template.hasPhoto ? "default" : "secondary"} className="ml-2">
                      {template.hasPhoto ? "With Photo" : "No Photo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template Preview */}
                  <div className="aspect-[3/4] bg-muted rounded-lg p-4 flex items-center justify-center">
                    <div className="w-full max-w-[200px]">{template.preview}</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Select Button */}
                  <Link href={`/builder?template=${template.id}`} className="block">
                    <Button className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      Select Template
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-4">CV Builder Pro</h3>
              <p className="text-sm text-muted-foreground">Create professional resumes that get you hired faster.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>FAQ</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Cookie Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 CV Builder Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
