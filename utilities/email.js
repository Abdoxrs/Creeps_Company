import nodemailer from 'nodemailer';

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message
 */

const sendEmail = async (options) => {
  let transporter;
  
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.EMAIL_PORT, 10) || 2525,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  try {
    await transporter.verify();
  } catch (err) {
    console.error('Email transporter verification failed:', err);
    throw new Error('Email transporter is not configured correctly');
  }

  const mailOptions = {
    from: `GO Company <${process.env.EMAIL_FROM || "noreply@go-company.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info && info.messageId ? info.messageId : info);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};

export default sendEmail;