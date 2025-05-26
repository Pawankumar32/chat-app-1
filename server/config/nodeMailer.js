import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    // Brevo email service
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,

    }

    // google email service
    // host: "sandbox.smtp.mailtrap.io",
    // port: 2525,
    // auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    // }

})

export default transporter;