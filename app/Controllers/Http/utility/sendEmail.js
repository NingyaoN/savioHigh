const data = await request.all();
console.log(data);
console.log("Sending")

let testAccount = await nodemailer.createTestAccount();

//create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
host: "smtp.ethereal.email",
port: 587,
secure: false, // true for 465, false for other ports
auth: {
user: testAccount.user, // generated ethereal user
pass: testAccount.pass // generated ethereal password
}
});

// send mail with defined transport object
let info = await transporter.sendMail({
from: 'ajaxning@gmail.com', // sender address
to: "ningyaocrow@gmail.com", // list of receivers
subject: "Hello ✔", // Subject line
text: "Hello world?", // plain text body
html: "<b style='color:red'>Hello world?</b>" // html body
});

console.log("Message sent: %s", info.messageId);
// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// Preview only available when sending through an Ethereal account
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));