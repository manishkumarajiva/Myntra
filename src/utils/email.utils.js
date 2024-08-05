const nodemailer = require('nodemailer');


const SendEmail = async(options) => {

    const Transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // user: 'moises.welch@ethereal.email',
            // pass: 'wksgaEBnB9FnWTF8HS'
            user: "manishkumarajiva@gmail.com",
            pass: "sjlapcqsykgtfvgu"
        }
    });
    
    
    const mailOptions = {
        from: "manishkumarajiva@gmail.com",
        to: "manishdhiman1322420@gmail.com",
        subject : options.subject,
        html: options.html
    };
    
    
    Transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
    });
};

module.exports = SendEmail;
