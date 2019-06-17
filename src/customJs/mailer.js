var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'contacto.hotelatino@gmail.com',
    password: 'mail2019_donthackusplease'
  },
  tls: {
    rejectUnauthorized: false
  }
});

var HelperOptions = {
  from: '"Hotel Latino" <contacto.hotelatino@gmail.com',
  to: '',
  subject: 'Reservación habitaciones',
  text: 'Tu código de reservación es AOSDIAFNAJDF. Te esperamos.'
}

let functions = {
  sendMail(destination) {
    HelperOptions.to = destination;
    transporter.sendMail(HelperOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      else {
        console.log("The message was sent!");
        console.log(info);
    
      }
    });
  }

}

export default functions;
