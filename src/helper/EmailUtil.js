const nodemailer = require("nodemailer");
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const emailAddress = process.env.MAIL_USERNAME
const emailPassword = process.env.MAIL_PASSWORD

let transporter;
(async () => {
  transporter = nodemailer.createTransport({
    service: "gmail",
    port: 25,
    auth: {
      user: emailAddress,
      pass: emailPassword,
    },
  });

  await transporter.verify();
})();

const sendSimpleTextEmail = async (options) => {
  /** options
   * from    : email sender
   * to      : email receiver 
   * subject : subject email
   * text    : content email
  /*/

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAddress,
      pass: emailPassword,
    },
  });

  await transporter.verify();

  const mailOptions = {
    from: `"${options.from} "<${emailAddress}>`,
    to: options.to,
    subject: options.subject,
    text: options.text
  };

  await transporter.sendMail(mailOptions)
}

const sendHTMLTemplateEmail = async (options) => {
  /** options
   * from         : email sender
   * to           : email receiver 
   * subject      : subject email
   * filename     : HTML filename (must be located in 'template' folder)
   * replacements : Object with replacement properties in HTML file
  /*/

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAddress,
      pass: emailPassword
    },
  });
  await transporter.verify();

  const filePath = path.join(__dirname, `./../../template/${options.filename}`);
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const templateBodyEmail = handlebars.compile(source);
  const htmlToSend = templateBodyEmail(options.replacements);


  const mailOptions = {
    from: `"${options.from} "<${emailAddress}>`,
    to: options.to,
    subject: options.subject,
    html: htmlToSend,
  };

  await transporter.sendMail(mailOptions)
}

const sendHTMLTemplateWithAttachmentEmail = async (options) => {
  /** options
   * from         : email sender
   * to           : email receiver 
   * subject      : subject email
   * filename     : HTML filename (must be located in 'template' folder)
   * replacements : Object with replacement properties in HTML file
   * attachments  : Array of object attachment (filename, cid), attachment must be located in 'template' folder,
                    could be a photo (ex. filename: logo.png; cid: 'unique@logo')
  /*/

  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   pool: true,
  //   auth: {
  //     user: emailAddress,
  //     pass: emailPassword,
  //   },
  // });

  // await transporter.verify();

  const filePath = path.join(__dirname, `./../../template/${options.filename}`);
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const templateBodyEmail = handlebars.compile(source);
  const htmlToSend = templateBodyEmail(options.replacements);

  options.attachments.forEach(attachment => {
    attachment.path = path.join(__dirname, `./../../template/${attachment.filename}`)
  });

  const mailOptions = {
    from: `"${options.from} "<${emailAddress}>`,
    to: options.to,
    subject: options.subject,
    html: htmlToSend,
    attachments: options.attachments
  };

  await transporter.sendMail(mailOptions)
  transporter.close();
}

module.exports = { sendSimpleTextEmail, sendHTMLTemplateEmail, sendHTMLTemplateWithAttachmentEmail }