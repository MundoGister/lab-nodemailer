const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const defaultFrom = process.env.EMAIL_SENDER;   

module.exports.confirmSignUp = (user) => {
    return transporter.sendMail({
        from: defaultFrom,
        to: user.email,
        subject: 'Confirm SignUp!',
        html: `
      <!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>
          ...
        </body>
        </html>
    `
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => { 
        console.error(error)
    });
}