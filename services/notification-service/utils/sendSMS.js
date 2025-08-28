import client from "../config/smsConfig.js";

function sendSMSMessage(body, from, to) {
  client.messages
    .create({ body, from, to })
    .then((message) => console.log(message.sid))
    .catch((err) => console.error(err));
}

export default sendSMSMessage;
