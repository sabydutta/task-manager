const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
        to: email,
        from: 'duttasaby.careers@gmail.com',
        subject:`Welcome to the app, ${name}`,
        text:`Welcome to the app, ${name}`
    })
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'duttasaby.careers@gmail.com',
        subject:`Sad to see you go, ${name}`,
        text:`It wont be the same without you, ${name}`
    })
}

module.exports ={
    sendWelcomeEmail,sendCancelEmail
}