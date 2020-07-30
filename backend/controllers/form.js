const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = (req, res) => {
  const { email, name, message } = req.body;
  // console.log(req.body);

  const emailData = {
    to: process.env.EMAIL_TO,
    from: email,
    subject: `Contact form - ${process.env.APP_NAME}`,
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
      <h4>Email received from contact form:</h4>
      <p>Sender name: ${name}</p>
      <p>Sender email: ${email}</p>
      <p>Sender message: ${message}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p>https://vnpace.dev</p>
    `,
  };

  sgMail
    .send(emailData)
    .then(() => {
      return res.json({
        success: true,
      });
    })
    .catch((error) => {
      console.log(error.response.body);
    });
};