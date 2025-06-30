import { NextResponse } from "next/server";
export const runtime = 'nodejs';
// Note: InferenceClient must be dynamically imported at runtime to avoid bundling issues.

// Load prompt (matching server.js approach)
const getPrompt = (workstation: string, jobInfo: string, experienceLevel: string,
   location: string, educationLevel: string) => {
  return `Eres un asistente de reclutamiento para un perfil ${experienceLevel} de ${workstation} con base en ${location} (o a un máximo de 20 minutos en transporte público). El candidato acaba de finalizar un ${educationLevel} en ${workstation} y aqui tienes mas informacion sobre mí:

  ${jobInfo}

  debes devolver exactamente una empresa nueva que no hayas mencionado antes y que cumpla todos estos criterios:

  Tiene oficina en ${location} o a ≤ 20 min en bus/metro.

  Se dedica a ${workstation}.

  Acepta perfiles ${experienceLevel}.

  Dispone de un correo electrónico válido para envío de CV o, si no tiene, no me lo propongas.

  Tu respuesta debe incluir:

  Nombre de la empresa

  dirección de email (solo direccion de email)

  Párrafo personalizado (1–2 frases) dirigiéndote directamente a su equipo y explicando el porque el mi perfil podria ser bueno para su empresa, te muestro un ejemplo de un correo que ya he enviado (este es un ejemplo para un desarrollador web, pero hazlo enfocado en ${workstation}):

  “Me interesa mucho Ideable porque admiro vuestro trabajo en procesos de transformación digital y el desarrollo de soluciones IoT y web a medida, especialmente el éxito de Kwido en el sector de la salud. Creo que formar parte de un equipo que combina innovación (IoT, VR, Big Data, Cloud) con proyectos reales para industria y administración pública me ayudaría a consolidar mis competencias en desarrollo de software mientras aporto mis ganas de aprender y mi base en WordPress.”

  IMPORTANTE:No listes varias empresas: solo una por respuesta. No repitas ninguna ya sugerida. Ademas asegurate de que esa empresa y su correo existan dentro del mundo del ${workstation}. El parrafo personalizado tiene que tener mas o menos los caracteres del ejemplo que te he puesto, no simules el parrafo personalizado y pongas ... Tampoco pongas notas ni comillas, solo lo que se pide`;
};

const getPrompt2 = (workstation: string, experienceLevel: string,
  location: string, educationLevel: string) => {
 return `Eres un asistente de reclutamiento para un perfil ${experienceLevel} de ${workstation} con base en ${location} (o a un máximo de 20 minutos en transporte público). El candidato acaba de finalizar un ${educationLevel} en ${workstation} y domina:

Lenguajes: HTML5, CSS3, JavaScript, PHP, Python, Java, C#

Frameworks / IDEs: React, Angular, Bootstrap, Tailwind, Laravel, Eclipse, HeidiSQL

CMS: WordPress

Bases de datos: MySQL

Control de versiones: Git / GitHub

Portafolio: https://danielgomezfullstack.vercel.app/

debes devolver exactamente una empresa nueva que no hayas mencionado antes y que cumpla todos estos criterios:

Tiene oficina en ${location} o a ≤ 20 min en bus/metro.

Se dedica a ${workstation}, apps o soluciones digitales.

Acepta perfiles ${experienceLevel}.

Dispone de un correo electrónico válido para envío de CV o, si no tiene, no me lo propongas.

Tu respuesta debe incluir:

Nombre de la empresa

dirección de email (solo direccion de email)

Párrafo personalizado (1–2 frases) dirigiéndote directamente a su equipo y explicando el porque el mi perfil podria ser bueno para su empresa, te muestro un ejemplo de un correo que ya he enviado:

“Me interesa mucho Ideable porque admiro vuestro trabajo en procesos de transformación digital y el desarrollo de soluciones IoT y web a medida, especialmente el éxito de Kwido en el sector de la salud. Creo que formar parte de un equipo que combina innovación (IoT, VR, Big Data, Cloud) con proyectos reales para industria y administración pública me ayudaría a consolidar mis competencias en desarrollo de software mientras aporto mis ganas de aprender y mi base en WordPress.”

IMPORTANTE:No listes varias empresas: solo una por respuesta. No repitas ninguna ya sugerida. Ademas asegurate de que esa empresa y su correo existan dentro del mundo del ${workstation}, apps o soluciones digitales. El parrafo personalizado tiene que tener mas o menos los caracteres del ejemplo que te he puesto, no simules el parrafo personalizado y pongas ... Tampoco pongas notas ni comillas, solo lo que se pide`;
};


export async function POST(request: Request) {
  try {

    // 1. Parsear el cuerpo JSON
    const body = await request.json();
    
    // 2. Desestructurar los campos que te interesan
    const {
      workstation,
      jobInfo,
      experienceLevel,
      location,
      educationLevel,
      smtpKey
    } = body as {
      workstation: string;
      jobInfo: string;
      experienceLevel: string;
      fullName: string;
      location: string;
      educationLevel: string;
      smtpKey: string;
    };



    let prompt = null
    if(smtpKey === "jolo bbmk tvhv tmrr") {
      prompt = getPrompt2(workstation, experienceLevel, location, educationLevel);
    }else{
      prompt = getPrompt(workstation, jobInfo, experienceLevel, location, educationLevel);
      
    }
    


    if (!process.env.HF_TOKEN) {
      console.log("HF_TOKEN not found, using mock data");
      return getMockResponse();
    }

    try {
      // Dynamically import and initialize InferenceClient for Node.js runtime
      const { InferenceClient } = await import('@huggingface/inference');
      const hf = new InferenceClient(process.env.HF_TOKEN!);(process.env.HF_TOKEN!);
      const chat = await hf.chatCompletion({
        model: 'mistralai/Magistral-Small-2506',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      });

      const raw = chat.choices?.[0]?.message?.content || '';
      const lines = raw
        .split(/\r?\n/)
        .map(line => line.replace(/[*_\-]+/g, '').trim())
        .filter(line => line);

      let nombre = '';
      let correo = '';
      let parrafo = '';

      for (const line of lines) {
        if (!nombre && !/\S+@\S+\.\S+/.test(line)) {
          nombre = line.replace(/^Nombre de la empresa:\s*/i, '');
          continue;
        }
        if (!correo && /\S+@\S+\.\S+/.test(line)) {
          correo = (line.match(/\S+@\S+\.\S+/) ?? [''])[0];
          continue;
        }
        parrafo += line.replace(/^[Pp][áa]rrafo.*?:\s*/i, '') + ' ';
      }
      parrafo = parrafo.trim();

      if (!nombre || !correo || !parrafo) {
        console.log('Parsing incomplete, using mock');
        return getMockResponse();
      }

      return NextResponse.json({ ok: true, nombre, correo, parrafo });
    } catch (error: any) {
      console.log('HF API error, using mock data:', error.message);
      return getMockResponse();
    }
  } catch (err: any) {
    console.error('ERROR GENERANDO EMPRESA:', err);
    return NextResponse.json({ ok: false, error: err.message });
  }
}

function getMockResponse() {
  const mockCompanies = [
    { nombre: "Tecnalia Research & Innovation", correo: "rrhh@tecnalia.com", parrafo: "Me llama mucho la atención Tecnalia porque admiro vuestro enfoque ..." },
    { nombre: "Serbatic", correo: "careers@serbatic.com", parrafo: "Serbatic me resulta muy interesante por vuestra especialización ..." },
    { nombre: "Izertis", correo: "empleo@izertis.com", parrafo: "Me atrae mucho Izertis por ser una empresa tecnológica ..." },
    { nombre: "Everis (NTT Data)", correo: "rrhh.euskadi@nttdata.com", parrafo: "NTT Data me parece una empresa fascinante ..." },
    { nombre: "Babel", correo: "seleccion@babel.es", parrafo: "Babel me llama la atención por vuestro enfoque ..." }
  ];
  const random = mockCompanies[Math.floor(Math.random() * mockCompanies.length)];
  return NextResponse.json({ ok: true, ...random });
}
