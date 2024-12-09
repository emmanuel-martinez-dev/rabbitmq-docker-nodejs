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
  const newQueue = "clients";

  const msgs = [
    { name: "Emmanuel", enterprise: "Google" },
    { name: "John", enterprise: "Amazon" },
    { name: "Michael", enterprise: "Facebook" },
    { name: "Bob", enterprise: "Microsoft" },
  ];
  try {
    const conn = await amqp.connect(amqpSettings);
    console.log("Connection Created...");

    const channel = await conn.createChannel();
    console.log("Channel Created...");

    const resEmployee = await channel.assertQueue(queue);
    console.log("Queue Created...");

    for (let msg in msgs) {
      await channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgs[msg])));
      console.log(`Message sent to Queue ${queue}`);
    }

    const resClient = await channel.assertQueue(newQueue);
    console.log("Queue Created...");

    for (let msg in msgs) {
      await channel.sendToQueue(
        newQueue,
        Buffer.from(JSON.stringify(msgs[msg]))
      );
      console.log(`Message sent to Queue ${newQueue}`);
    }
  } catch (e) {
    console.error(`Error -> ${e}`);
  }
}
