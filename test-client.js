const net = require("net");

const client = net.createConnection(
    {
        host: "127.0.0.1",
        port: 8000
    },
    () => {
        console.log("Connected to Mini Redis");

        sendSetCommand();
    }
);

function sendSetCommand() {
    const command =
        "*3\r\n" +
        "$3\r\n" +
        "SET\r\n" +
        "$4\r\n" +
        "name\r\n" +
        "$6\r\n" +
        "Apoorv\r\n";

    console.log("Sending SET...");
    client.write(command);
}

client.on("data", (data) => {
    console.log("Server response:");
    console.log(data.toString());

    // SET ke baad GET bhejo
    if (data.toString() === "+OK\r\n") {
        sendGetCommand();
    } else {
        client.end();
    }
});

function sendGetCommand() {
    const command =
        "*2\r\n" +
        "$3\r\n" +
        "GET\r\n" +
        "$4\r\n" +
        "name\r\n";

    console.log("Sending GET...");
    client.write(command);
}

client.on("error", (error) => {
    console.error(
        "Client error:",
        error.message
    );
});

client.on("close", () => {
    console.log("Connection closed");
});