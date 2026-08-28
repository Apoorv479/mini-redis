const net = require("net");

const client = net.createConnection(
    {
        host: "127.0.0.1",
        port: 8000
    },
    () => {

        console.log("Connected to Mini Redis");

        // RESP encoded command
        //
        // SET name Apoorv
        //
        const command =
            "*3\r\n" +
            "$3\r\n" +
            "SET\r\n" +
            "$4\r\n" +
            "name\r\n" +
            "$6\r\n" +
            "Apoorv\r\n";

        console.log("Sending:");
        console.log(command);

        client.write(command);
    }
);


client.on("data", (data) => {

    console.log("Response from server:");

    console.log(data.toString());

    client.end();
});


client.on("error", (error) => {

    console.error(
        "Client error:",
        error.message
    );
});


client.on("close", () => {

    console.log("Connection closed");
});