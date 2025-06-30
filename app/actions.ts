"use server"

// Updated server actions to use API routes instead of direct nodemailer

export async function sendManualEmail(data: { email: string; company: string; message: string }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error in sendManualEmail:", error)
    return { success: false, error: error.message }
  }
}

export async function generateAIProposal() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/generate-ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error in generateAIProposal:", error)
    return { success: false, error: error.message }
  }
}
