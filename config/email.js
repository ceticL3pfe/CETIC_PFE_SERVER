require('dotenv').config();
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken')

const MAIL_ADDRESS = process.env.EMAIL;
const MAIL_PASSWORD = process.env.E_PASSWORD;



const mailConfiguation = {
    service: "gmail",
    auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASSWORD,
    },
}

const transporter = nodeMailer.createTransport(mailConfiguation);
const EMAIL = process.env.EMAIL
const SECRET_KEY = process.env.SECRET_KEY
const sendVerificationEmail = async ( email, token) => {
    // console.log(email)
    if (!email || !token ) {
        console.log('token or email are empty',token,email)
        return false
    }
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'password edit',
        text: 'Hello',
        html: `<h1>your backup code ,  COPY it : </h1></br><p>${token}</p>`,
    }

   const rep = await transporter.sendMail(mailOptions).then(() => {
        return true
    }).catch(err => {
        console.log("errorrrorro:;::::", err)
        return false
    })
    return rep
}



const verifyEmailToken = (token) => {
    let response
try{
     response = jwt.verify(token, SECRET_KEY)

}catch(err){
    console.error(err)
    return false
}
        
    
    return response


}

module.exports = {
    sendVerificationEmail,
    verifyEmailToken

}