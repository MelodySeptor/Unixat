var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'unichatInfor@gmail.com',
      pass: ''
    }
  });

var mailOptions = {
  from: 'unichatInfo@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Confirmacion de Unichat',
  text: ''
};

sendMailConfirmacion = function(mailUser, codeMail){
  mailOptions.to = mailUser
  mailOptions.text = 'Confirma tu usuario en: unichat.com/'+codeMail
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent');
      }
    });
}

sendMailRecuperar = function(mailUser, newPass){
  mailOptions.to = mailUser
  mailOptions.text = 'Tu nueva contraseña es: ' + newPass
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent');
      }
    });
}

sendMailSoporte = function(mailUser, text){
  mailOptions.to = 'unichatInfor@gmail.com'
  mailOptions.subject = "Soporte"
  mailOptions.text = text + ' De: ' + mailUser
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent');
      }
    });
}
