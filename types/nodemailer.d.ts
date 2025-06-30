declare module "nodemailer" {
  export function createTransport(options: any): any
  export interface SendMailOptions {
    from?: string
    to?: string
    subject?: string
    html?: string
    attachments?: any[]
  }
}
