const amqp = require("amqplib");

const amqpSettings = {
  protocol: "amqp",
  hostname: "localhost",
  port: 5672,
  username: "emmanuel",
  password: "emmanuel",
  vhost: "/",
  authMechanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"],
};

connect();
async function connect() {
  const queue = "employees";
  const enterprise = "Microsoft";
  try {
    const conn = await amqp.connect(amqpSettings);
    console.log("Connection Created...");

    const channel = await conn.createChannel();
    console.log("Channel Created...");

    const res = await channel.assertQueue(queue);
    console.log("Queue Created...");

    console.log(`Waiting for messages in -> ${enterprise}`);
    channel.consume(queue, (msg) => {
      let employee = JSON.parse(msg.content.toString());
      console.log(`Received employee ${employee.name} from ${enterprise}`);
      console.log(employee);

      // if (employee.enterprise === enterprise) {
      //   channel.ack(msg);
      //   console.log("Deleted message from queue... \n");
      // } else {
      //   console.log("Message not deleted from queue... \n");
      // }
    });
  } catch (e) {
    console.error(`Error -> ${e}`);
  }
}
