"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Send, Loader2 } from "lucide-react"
import { Sparkles } from "lucide-react" // Import Sparkles component

interface AIProposalModalProps {
  proposal: {
    company: string
    email: string
    message: string
  }
  onClose: () => void
  onSend: (data: { email: string; company: string; message: string }) => Promise<void>
}

export function AIProposalModal({ proposal, onClose, onSend }: AIProposalModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(proposal)
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    setIsSending(true)
    try {
      await onSend(editData)
      onClose()
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Propuesta Generada por IA
          </DialogTitle>
          <DialogDescription>Revisa y edita la propuesta antes de enviarla</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isEditing ? (
            // View Mode
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Empresa</Label>
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="font-medium text-blue-900">{editData.company}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Correo</Label>
                <div className="p-3 bg-green-50 rounded-md border border-green-200">
                  <p className="text-green-700 font-mono">{editData.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Mensaje Personalizado</Label>
                <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
                  <p className="whitespace-pre-wrap text-purple-900 leading-relaxed">{editData.message}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleEdit} variant="outline" className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button onClick={handleSend} disabled={isSending} className="flex-1">
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-company">Empresa</Label>
                <Input
                  id="edit-company"
                  value={editData.company}
                  onChange={(e) => setEditData((prev) => ({ ...prev, company: e.target.value }))}
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Correo</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-message">Mensaje Personalizado</Label>
                <Textarea
                  id="edit-message"
                  rows={6}
                  value={editData.message}
                  onChange={(e) => setEditData((prev) => ({ ...prev, message: e.target.value }))}
                  className="border-purple-300 focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} variant="outline" className="flex-1">
                  Guardar Cambios
                </Button>
                <Button onClick={handleSend} disabled={isSending} className="flex-1">
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
