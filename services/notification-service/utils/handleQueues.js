import { createChannel } from "../config/messageQueue.js";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import sendSMSMessage from "../utils/sendSMS.js";
dotenv.config();

async function receiveEmailQueue() {
  const queueName = "emailQueue";
  try {
    const channel = await createChannel(queueName);

    console.log(
      " [*] Waiting for messages in %s. To exit press CTRL+C",
      queueName
    );

    channel.consume(
      queueName,
      async function (msg) {
        console.log(" [x] Received ");
        const emailData = JSON.parse(msg.content.toString());
        // get User Data
        console.log(msg.content.toString());
        console.log(emailData);
        console.log(emailData.data);
        console.log(emailData.data.userId);

        const responseUser = await fetch(
          `http://${process.env.AUTH_SERVICE}/${emailData.data.userId}`
        );
        const userdata = await responseUser.json();
        console.log(userdata);
        console.log(userdata.data);

        // get Order Items
        const responseItems = await fetch(
          `http://${process.env.ORDER_SERVICE}/${emailData.data.id}`
        );
        const itemsData = await responseItems.json();
        const orderItems = itemsData.order.OrderItems;

        let itemsHtml = "";
        orderItems.forEach(async (item) => {
          itemsHtml += `
          <tr>
            <td>${item.productName}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">${item.price} DZD</td>
          </tr>
  `;
        });

        const { totalAmount, id } = emailData.data;
        const { phone_number, email, full_name } = userdata.data;
        const ORDER_ID = id.split("-")[0].toUpperCase();

        await sendEmail({
          to: email,
          subject: "Order Confirmation",
          template: "orderConfirmation.html",
          variables: {
            subject: "Order Confirmation",
            brandName: "MyShop",
            customerName: full_name,
            orderId: ORDER_ID,
            orderItems: itemsHtml,
            total: totalAmount,
            trackingUrl: "https://tracking-link.com/12345",
            unsubscribeUrl: "https://myshop.com/unsubscribe",
            year: new Date().getFullYear(),
          },
        });

        sendSMSMessage(
          `✅ Your order ${ORDER_ID} has been successfully purchased. \nTotal: ${totalAmount} DZD \nTrack it here: https://yourshop.com/orders/1234 \nThank you for shopping with us!`,
          "+15716095741",
          phone_number
        );
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("❌ Error while sending to queue:", error);
  }
}

export { receiveEmailQueue };
