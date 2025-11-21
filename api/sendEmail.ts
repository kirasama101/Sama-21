import nodemailer from 'nodemailer';

interface Request {
    method?: string;
    body?: {
        subject?: string;
        message?: string;
    };
}

interface Response {
    status: (code: number) => Response;
    json: (data: unknown) => void;
}

export default async function handler(req: Request, res: Response) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { subject, message } = req.body;

        // Validate input
        if (!subject || !message) {
            return res.status(400).json({ error: 'Subject and message are required' });
        }

        // Get SMTP credentials from environment variables
        const smtpEmail = process.env.SMTP_EMAIL;
        const smtpPass = process.env.SMTP_PASS;

        if (!smtpEmail || !smtpPass) {
            return res.status(500).json({ error: 'SMTP credentials not configured' });
        }

        // Create transporter for Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpEmail,
                pass: smtpPass,
            },
        });

        // Send email
        await transporter.sendMail({
            from: smtpEmail,
            to: 'emad23.work@gmail.com',
            subject: subject,
            text: message,
            html: message.replace(/\n/g, '<br>'),
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

