import { color } from "bun";
import mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async(options) => {
    const mailGenarator = new mailgen({
        theme: "default",
        product: {
            name : "Finance Data Processing",
            link : "https://financedata.com"
        }
    });

    const emailTextual = mailGenarator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGenarator.generate(options.mailgenContent);

    const transport = nodemailer.createTransport({
        host : process.env.MAILTRAP_SMTP_HOST,
        port : process.env.MAILTRAP_SMTP_PORT,
        auth : {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        }
    });
 
    const mail = {
        from : "mail.Zorvyn@gmail.com",
        to : options.email,
        subject: options.subject,
        text : emailTextual,
        html : emailHTML
    }
    try{
       await transport.sendMail(mail);
    } catch(error){
        console.log("Email Service failed");
    }
}

const emailVerificationMailgenContent = (username,verificationURL) => {
    return {
        body : {
            name : username,
            intro : "Welcome to Zorvyn",

            action : {
                instruction : "To Verify ypur email please click on the following button",
                button : {
                    color: "#2582c0",
                    text : "Verify your email",
                    link : verificationURL
                }
            },
            outro : "Need help, or have any qustion ? Just reply to this email"
        },
    };
};

const forgotPasswordMailgenContent = (username,PasswordResetUrl) => {
    return {
        body: {
            name: username,
            intro : "We got the request to reset the password of your account",

            action : {
                instruction : 
                    "To reset your password. Please click on the below button or link",
                button : {
                    color : "#5f27cf",
                    text : "Reset Password",
                    link : PasswordResetUrl,
                },
            },
            outro : "Need help, Or have any question? Feel free to contact Zorvyn or reply to this email"
        },
    }
};

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}