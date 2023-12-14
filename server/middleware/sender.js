import nodemailer from 'nodemailer';


async function send (to, subject, type, token) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            //user:
            //pass:
        }
    });
    let htmlContent = '';

    if (type === 'register') {
        htmlContent = `
            <p>Thank you for registering!</p>
            <p>Link to register: http://localhost:3000/confirmation/${token}</p>
        `;
    } else {
        htmlContent = `
            <p>Forgot your password?</p>
            <p>Link to reset your password: http://localhost:3000/password-reset/${token}</p>
        `;
    }
    const mailOptions = {
        from: "superannetv@gmail.com",
        to: to,
        subject: subject,
        text: token,
        html: htmlContent
    }
    try {
        await transporter.sendMail(mailOptions, function (err, info) {
            console.log('Email sent successfully.');
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return true;
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

export default send;

