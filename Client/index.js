const signalR = require("@aspnet/signalr");

let userName = "User 1";

function SendMessage(connection) {
  let message = "Hello there !";
  connection.invoke("SendMessage", userName, message);
  console.log(`Message: ${message}`);
}

function ReceiveMessage(user, message) {
  console.log(`User: ${user}, Message: ${message}`);
}

function ScheduleNext(connection) {
  let seconds = Math.floor(Math.random() * 10) + 1;
  setTimeout(() => SendMessage(connection), 1000 * seconds);
  console.log(`Next message in ${seconds} second(s)`);
}

async function StartAsync(connection) {
  try {
    await connection.start();
  } catch (err) {
    setTimeout(() => StartAsync(connection), 5000);
  }

  return connection;
}

function CreateConnection() {
  let connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:1954/chat")
    // .withUrl("https://localhost:44331/chat")
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveMessage", (user, message) => {
    ReceiveMessage(user, message);
    ScheduleNext(connection);
  });

  connection.onclose(async () => {
    await StartAsync(connection);
  });

  return connection;
}

StartAsync(CreateConnection()).then(connection => {
  ScheduleNext(connection);
});
