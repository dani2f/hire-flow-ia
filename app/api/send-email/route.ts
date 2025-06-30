// app/api/send-email/route.ts
import { NextResponse } from "next/server"
import fs from "fs"
import nodemailer from "nodemailer"

// Desactiva el bodyParser de Next.js
export const config = {
  api: { bodyParser: false },
}


const getEmailTemplate = (company: string, message: string, fullName: string, workstation: string, senderEmail: string,
  location: string, phone: string, linkedin: string, jobInfo: string, educationLevel: string, experienceLevel: string
) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Candidatura - ${fullName}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 8px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content { 
      padding: 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .intro {
      background: #f8f9ff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin: 20px 0;
    }
    .skills { 
      margin: 25px 0; 
      background: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
    }
    .skills h3 {
      margin-top: 0;
      color: #334155;
      font-size: 18px;
    }
    .skills ul { 
      list-style: none;
      padding: 0;
      margin: 15px 0 0 0;
    }
    .skills li {
      margin: 12px 0;
      padding: 8px 12px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }
    .skills strong {
      color: #475569;
    }
    .personalized {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
      border: 1px solid #e1bee7;
    }
    .personalized h3 {
      margin-top: 0;
      color: #4a148c;
      font-size: 18px;
    }
    .links {
      background: #fff3e0;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #ff9800;
    }
    .links a {
      color: #e65100;
      text-decoration: none;
      font-weight: 500;
    }
    .links a:hover {
      text-decoration: underline;
    }
    .contact-info {
      background: #e8f5e8;
      padding: 20px;
      border-radius: 8px;
      margin-top: 25px;
      border: 1px solid #c8e6c9;
    }
    .contact-info h3 {
      margin-top: 0;
      color: #2e7d32;
    }
    .contact-item {
      margin: 8px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .contact-item strong {
      min-width: 80px;
      color: #388e3c;
    }
    .footer { 
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Solicitud de Candidatura</h2>
      <p>${fullName} - ${workstation}</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        <p>Estimado equipo de <strong>${company}</strong>,</p>
      </div>
      
      <div class="intro">
        <p>Soy <strong>${fullName}</strong>, recién graduado en ${educationLevel} en ${workstation}, y me gustaría presentar mi candidatura para un puesto ${experienceLevel} en vuestro equipo de ${workstation}.</p>
      </div>

      <div class="skills">
        <h3>🚀 Tecnologías y Herramientas</h3>
        <p>${jobInfo}</p>
      </div>

      <div class="personalized">
        <h3>💡 ¿Por qué ${company}?</h3>
        <p>${message}</p>
      </div>

      <p>Adjunto mi currículum en PDF, donde tenéis más detalles sobre mi formación. Quedo a vuestra disposición para ampliar cualquier información o para concertar una entrevista.</p>
      
      <p>Muchas gracias por vuestro tiempo. Espero tener noticias vuestras pronto.</p>
      
      <div class="contact-info">
        <h3>📞 Información de Contacto</h3>
        <div class="contact-item">
          <strong>📧 Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a>
        </div>
        <div class="contact-item">
          <strong>📱 Teléfono:</strong> <a href="tel:${phone}">${phone}</a>
        </div>
        <div class="contact-item">
          <strong>🔗 LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a>
        </div>
        <div class="contact-item">
          <strong>📍 Ubicación:</strong>${location}
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Este email fue enviado desde HireFlow - Sistema de candidaturas inteligente </p>
      <p>Desarrollado por Daniel Gómez Cuevas</p>
    </div>
  </div>
</body>
</html>
  `
}


const getEmailTemplate2 = (company: string, message: string, fullName: string, workstation: string, senderEmail: string,
  location: string, phone: string, linkedin: string, jobInfo: string, educationLevel: string, experienceLevel: string
) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Candidatura - ${fullName}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 8px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content { 
      padding: 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .intro {
      background: #f8f9ff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin: 20px 0;
    }
    .skills { 
      margin: 25px 0; 
      background: #f1f5f9;
      padding: 20px;
      border-radius: 8px;
    }
    .skills h3 {
      margin-top: 0;
      color: #334155;
      font-size: 18px;
    }
    .skills ul { 
      list-style: none;
      padding: 0;
      margin: 15px 0 0 0;
    }
    .skills li {
      margin: 12px 0;
      padding: 8px 12px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #667eea;
    }
    .skills strong {
      color: #475569;
    }
    .personalized {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
      border: 1px solid #e1bee7;
    }
    .personalized h3 {
      margin-top: 0;
      color: #4a148c;
      font-size: 18px;
    }
    .links {
      background: #fff3e0;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #ff9800;
    }
    .links a {
      color: #e65100;
      text-decoration: none;
      font-weight: 500;
    }
    .links a:hover {
      text-decoration: underline;
    }
    .contact-info {
      background: #e8f5e8;
      padding: 20px;
      border-radius: 8px;
      margin-top: 25px;
      border: 1px solid #c8e6c9;
    }
    .contact-info h3 {
      margin-top: 0;
      color: #2e7d32;
    }
    .contact-item {
      margin: 8px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .contact-item strong {
      min-width: 80px;
      color: #388e3c;
    }
    .footer { 
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Solicitud de Candidatura</h2>
      <p>${fullName} - ${workstation}</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        <p>Estimado equipo de <strong>${company}</strong>,</p>
      </div>
      
      <div class="intro">
        <p>Soy <strong>${fullName}</strong>, recién graduado en ${educationLevel} en ${workstation}, y me gustaría presentar mi candidatura para un puesto ${experienceLevel} en vuestro equipo de ${workstation}.</p>
      </div>

      <div class="skills">
        <h3>🚀 Tecnologías y Herramientas</h3>
        <p>Durante mis estudios he trabajado con:</p>
        <ul> 
          <li><strong>Lenguajes:</strong> HTML5, CSS3, JavaScript, PHP, Python, Java, C#</li>
          <li><strong>Frameworks/Bibliotecas/IDEs:</strong> React, Angular, Bootstrap, Tailwind, Laravel, Eclipse, HeidiSQL</li>
          <li><strong>Gestión de contenidos:</strong> WordPress</li>
          <li><strong>Bases de datos:</strong> MySQL</li>
          <li><strong>Control de versiones:</strong> Git / GitHub</li>
        </ul>
      </div>

      <div class="links">
        <p><strong>📂 Mis proyectos y portafolio:</strong></p>
        <p>
          <strong>GitHub:</strong> <a href="https://github.com/dani2f">https://github.com/dani2f</a><br>
          <strong>Portafolio:</strong> <a href="https://danielgomezfullstack.vercel.app">https://danielgomezfullstack.vercel.app</a>
        </p>
      </div>

      <div class="personalized">
        <h3>💡 ¿Por qué ${company}?</h3>
        <p>${message}</p>
      </div>

      <p>Adjunto mi currículum en PDF, donde tenéis más detalles sobre mi formación y proyectos. Quedo a vuestra disposición para ampliar cualquier información o para concertar una entrevista.</p>
      
      <p>Muchas gracias por vuestro tiempo. Espero tener noticias vuestras pronto.</p>
      
      <div class="contact-info">
        <h3>📞 Información de Contacto</h3>
        <div class="contact-item">
          <strong>📧 Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a>
        </div>
        <div class="contact-item">
          <strong>📱 Teléfono:</strong> <a href="tel:${phone}">${phone}</a>
        </div>
        <div class="contact-item">
          <strong>🔗 LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a>
        </div>
        <div class="contact-item">
          <strong>📍 Ubicación:</strong>${location}
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Este email fue enviado desde HireFlow - Sistema de candidaturas inteligente </p>
      <p>Desarrollado por Daniel Gómez Cuevas</p>
    </div>
  </div>
</body>
</html>
  `
}





export async function POST(request: Request) {
  try {

    console.log("--------------------------------")
    console.log("Enviando en route.ts")

    // 1) Parseamos el formData con la API Web
    const formData = await request.formData()
    const emailField = formData.get("email")
    const companyField = formData.get("empresa")
    const messageField = formData.get("personalizado")



    const fullName = formData.get("fullName")
    const senderEmail = formData.get("senderEmail")
    const smtpKey = formData.get("smtpKey")

    console.log("--------------------------------")
    console.log("key", smtpKey)

    const workstation = formData.get("workstation")
    const jobInfo = formData.get("jobInfo")
 
    
    const location = formData.get("location")
    const phone = formData.get("phone")
    const linkedin = formData.get("linkedin")
    const educationLevel = formData.get("educationLevel")
    const experienceLevel = formData.get("experienceLevel")

    


    if (
      typeof emailField !== "string" ||
      typeof companyField !== "string" ||
      typeof messageField !== "string" ||
      typeof fullName !== "string" ||
      typeof workstation !== "string" ||
      typeof jobInfo !== "string" ||
      typeof experienceLevel !== "string" ||
      typeof senderEmail !== "string" ||
      typeof location !== "string" ||
      typeof phone !== "string" ||
      typeof linkedin !== "string" ||
      typeof educationLevel !== "string"
    ) {
      return NextResponse.json(
        { ok: false, error: "Campos inválidos o faltantes" },
        { status: 400 }
      )
    }

    // 2) Preparamos adjuntos si hay CV
    const attachments: { filename: string; content: Buffer; contentType: string }[] = []
    const cvFile = formData.get("cv")
    if (cvFile && cvFile instanceof File) {
      const arrayBuf = await cvFile.arrayBuffer()
      attachments.push({
        filename: cvFile.name,
        content: Buffer.from(arrayBuf),
        contentType: cvFile.type || "application/pdf",
      })
    }

    // 3) Si no hay SMTP configurado, simulamos el envío
    if (!senderEmail || !smtpKey) {
      return NextResponse.json({ ok: true, message: "Envío simulado" })
    }

    // 4) Configuramos nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: senderEmail,
        pass: smtpKey,
      },
    })
    await transporter.verify()
    
    let htmlTemplate = null
    console.log("--------------------------------")
    if(smtpKey === "jolo bbmk tvhv tmrr") {
      console.log("Enviando email con template de dani")
      htmlTemplate = getEmailTemplate2(companyField, messageField, fullName, workstation, senderEmail, location, phone, linkedin, jobInfo, educationLevel, experienceLevel)
    }else{
      console.log("Enviando email con template general")
      htmlTemplate = getEmailTemplate(companyField, messageField, fullName, workstation, senderEmail, location, phone, linkedin, jobInfo, educationLevel, experienceLevel)
    }

    // 5) Enviamos el correo
    const info = await transporter.sendMail({
      from: `"${fullName}" <${process.env.SMTP_USER}>`,
      to: emailField,
      subject: `Candidatura ${workstation} ${experienceLevel} – ${companyField}`,
      html: htmlTemplate,
      attachments,
    })

    return NextResponse.json({ ok: true, messageId: info.messageId })
  } catch (err: any) {
    console.error("Error en POST /api/send-email:", err)
    return NextResponse.json(
      { ok: false, error: err.message || "Error interno" },
      { status: 500 }
    )
  }
}