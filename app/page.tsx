"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Mail, Sparkles, Send, Upload, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Step = 1 | 2

type SubStep = 1 | 2 | 3

export default function HireFlowApp() {
  const [step, setStep] = useState<Step>(1)
  const [subStep, setSubStep] = useState<SubStep>(1)
  const [formData, setFormData] = useState({
    senderEmail: "",
    smtpKey: "",
    fullName: "",
    phone: "",
    location: "",
    educationLevel: "",
    workstation: "",
    jobInfo: "",
    experienceLevel: "",
    linkedin: "",
    email: "",
    empresa: "",
    personalizado: "",
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateSubStep = () => {
    if (subStep === 1) {
      const { senderEmail, smtpKey } = formData
      if (!senderEmail || !smtpKey) {
        toast({ title: "Error", description: "Completa correo y SMTP", variant: "destructive" })
        return false
      }
    }
    if (subStep === 2) {
      const { fullName, phone, location, educationLevel } = formData
      if (!fullName || !phone || !location || !educationLevel) {
        toast({ title: "Error", description: "Completa datos personales", variant: "destructive" })
        return false
      }
    }
    if (subStep === 3) {
      const { workstation, jobInfo, experienceLevel } = formData
      if (!workstation || !jobInfo || !experienceLevel) {
        toast({ title: "Error", description: "Completa perfil profesional", variant: "destructive" })
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (!validateSubStep()) return
    if (subStep < 3) setSubStep(prev => (prev + 1) as SubStep)
    else setStep(2)
  }

  const sendEmail = async (form: FormData) => {
    const res = await fetch("/api/send-email", { method: "POST", body: form })
    const text = await res.text()
    try { return JSON.parse(text) } catch { throw new Error("JSON inválido en respuesta del servidor") }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { email, empresa, personalizado } = formData
    if (!email || !empresa || !personalizado) {
      toast({ title: "Error", description: "Completa los datos de la candidatura", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const form = new FormData()
      form.append("senderEmail", formData.senderEmail)
      form.append("smtpKey", formData.smtpKey)
      form.append("fullName", formData.fullName)
      form.append("phone", formData.phone)
      form.append("location", formData.location)
      form.append("educationLevel", formData.educationLevel)
      form.append("workstation", formData.workstation)
      form.append("jobInfo", formData.jobInfo)
      form.append("experienceLevel", formData.experienceLevel)
      form.append("linkedin", formData.linkedin)
      if (cvFile) form.append("cv", cvFile, cvFile.name)
      form.append("email", email)
      form.append("empresa", empresa)
      form.append("personalizado", personalizado)

      
      const data = await sendEmail(form)
      if (data.ok) {
        toast({ title: "¡Éxito!", description: "Email enviado correctamente" })
        setFormData(prev => ({ ...prev, email: "", empresa: "", personalizado: "" }))
      } else throw new Error(data.error)
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Error al enviar el email", variant: "destructive" })
    } finally { setIsSubmitting(false) }
  }

  const handleAIGeneration = async () => {
    setIsGeneratingAI(true)
    try {
      const { workstation, jobInfo, experienceLevel, fullName, location, educationLevel } = formData
      const resp = await fetch("/api/sugerir-empresa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workstation, jobInfo, experienceLevel, fullName, location, educationLevel }),
      })
      const result = await resp.json()
      if (result.ok) {
        // Rellenar directamente los campos con la respuesta de la IA
        setFormData(prev => ({
          ...prev,
          email: result.correo,
          empresa: result.nombre,
          personalizado: result.parrafo,
        }))
        // Avanzar automáticamente al paso de envío
        setStep(2)
      } else throw new Error(result.error)
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Error al generar propuesta con IA", variant: "destructive" })
    } finally { setIsGeneratingAI(false) }
  }

  const handleAISend = async ({ email, empresa, personalizado }: { email: string; empresa: string; personalizado: string }) => {
    await handleManualSubmit(new Event("submit") as any)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file?.type === "application/pdf") {
      setCvFile(file)
      toast({ title: "CV cargado", description: `Archivo: ${file.name}` })
    } else {
      toast({ title: "Error", description: "Por favor, selecciona un archivo PDF", variant: "destructive" })
    }
  }

  const isFormValid =
    formData.senderEmail &&
    formData.smtpKey &&
    formData.fullName &&
    formData.phone &&
    formData.location &&
    formData.educationLevel &&
    formData.workstation &&
    formData.jobInfo &&
    formData.experienceLevel &&
    formData.email &&
    formData.empresa &&
    formData.personalizado

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" /> HireFlow
          </h1>
          <p className="text-lg text-gray-600">Envía propuestas de trabajo personalizadas con IA</p>
          <p className="text-sm text-gray-500">Globaliza tu búsqueda de empleo</p>
        </div>

        {step === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap /> Configuración</CardTitle>
              <CardDescription>Bloque {subStep} de 3</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {subStep === 1 && (
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext() }}>
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Correo remitente</Label>
                    <Input id="senderEmail" type="email" placeholder="tucorreo@gmail.com" value={formData.senderEmail} onChange={e => handleInputChange("senderEmail", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpKey">Clave SMTP de Gmail</Label>
                    <Input id="smtpKey" type="text" placeholder="Clave SMTP" value={formData.smtpKey} onChange={e => handleInputChange("smtpKey", e.target.value)} />
                    <p className="text-xs text-gray-500">¿No sabes dónde encontrarla? <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Aquí</a></p>
                  </div>
                  <Button type="submit" className="w-full">Siguiente bloque</Button>
                </form>
              )}

              {subStep === 2 && (
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext() }}>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input id="fullName" type="text" placeholder="Tu Nombre y Apellido" value={formData.fullName} onChange={e => handleInputChange("fullName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" placeholder="+34 600 123 456" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input id="location" type="text" placeholder="Madrid, España" value={formData.location} onChange={e => handleInputChange("location", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Nivel de estudios</Label>
                    <select id="educationLevel" value={formData.educationLevel} onChange={e => handleInputChange("educationLevel", e.target.value)} className="block w-full rounded border p-2">
                      <option value="">Selecciona...</option>
                      <option value="FP Medio">FP Medio</option>
                      <option value="FP Superior">FP Superior</option>
                      <option value="Universidad">Universidad</option>
                      <option value="Universidad + Máster">Universidad + Máster</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">Siguiente bloque</Button>
                </form>
              )}

              {subStep === 3 && (
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext() }}>
                  <div className="space-y-2">
                    <Label htmlFor="workstation">Campo de búsqueda</Label>
                    <Input id="workstation" type="text" placeholder="Desarrollo Web" value={formData.workstation} onChange={e => handleInputChange("workstation", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobInfo">Información relevante sobre ti para la candidatura (tecnologías, estudios, etc.)</Label>
                    <Textarea id="jobInfo" placeholder="Describe tus habilidades, estudios y tecnologías dominadas" rows={4} value={formData.jobInfo} onChange={e => handleInputChange("jobInfo", e.target.value)} /></div>
                 <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Nivel de experiencia</Label>
                    <select id="experienceLevel" value={formData.experienceLevel} onChange={e => handleInputChange("experienceLevel", e.target.value)} className="block w-full rounded border p-2">
                      <option value="">Selecciona...</option>
                      <option value="Prácticas/Junior">Prácticas/Junior</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn (opcional)</Label>
                    <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/tu-perfil" value={formData.linkedin} onChange={e => handleInputChange("linkedin", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cv">CV (PDF)</Label>
                    <Input id="cv" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                    <Button variant="outline" type="button" onClick={() => document.getElementById("cv")?.click()}>
                      <Upload className="h-4 w-4" /> {cvFile ? cvFile.name : "Subir CV"}
                    </Button>
                  </div>
                  <Button type="submit" className="w-full">Continuar al paso 2</Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail /> Enviar Candidatura</CardTitle>
              <CardDescription>Datos de la oferta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo destinatario</Label>
                  <Input id="email" type="email" placeholder="rrhh@empresa.com" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" type="text" placeholder="Nombre de la empresa" value={formData.empresa} onChange={e => handleInputChange("empresa", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personalizado">Mensaje personalizado</Label>
                  <Textarea id="personalizado" placeholder="Escribe por qué te interesa esta empresa" rows={6} value={formData.personalizado} onChange={e => handleInputChange("personalizado", e.target.value)} required />
                  <p className="text-xs text-gray-500">Tip: Menciona qué te atrae y cómo aportarás</p>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <Button type="submit" disabled={!isFormValid || isSubmitting} className="w-full">
                    {isSubmitting
                      ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>)
                      : (<><Send className="mr-2 h-4 w-4" />Enviar Candidatura</>)
                  }</Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">O</span></div>
                  </div>
                  <Button type="button" variant="secondary" onClick={handleAIGeneration} disabled={isGeneratingAI} className="w-full">
                    {isGeneratingAI
                      ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Generando...</>)
                      : (<><Sparkles className="mr-2 h-4 w-4"/>Generar con IA</>)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        
      </div>
    </div>
  )
}
