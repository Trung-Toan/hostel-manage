import emailjs from 'emailjs-com';

const sendEmail = (email, subject, message) => {
  return emailjs.send(
    'service_drveurc',
    'template_abotd4t',
    {
      email: email,
      subject: subject,
      message: message,
    },
    'OEj4kkgxdJXtWCV0_'
  );
};

export default { sendEmail };
