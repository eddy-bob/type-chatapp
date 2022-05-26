import * as nodemailer from "nodemailer"
import endpoint from "../config/endpoints.config";

const sendMail = async (reciever: string, sender: string, message: string, subject: any, url?: string) => {
  var error;
  const transporter = await nodemailer.createTransport({
    port: 465,
    secure: true,
    host: endpoint.mailerHost,
    auth: {
      user: endpoint.mailUsername,
      pass: endpoint.mailPassword,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail(
    {
      from: sender,
      to: reciever,
      subject: subject,

      html: `<p>${message}</p>
      <a href=${url}> Verify Email Here</a> 
      `,
    },

    function (err: any, result: any) {
      console.log("this is the result from nodemailer" + result);
      console.log("this is the err from nodemailer" + err);
      error = err;
      if (err) {
        error = err;
      } else {
        console.log(result);
      }
    }
  );
  return error;
};
export default sendMail;
