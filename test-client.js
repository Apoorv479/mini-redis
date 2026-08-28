const net = require("net");

const client = net.createConnection(
    {
        host: "127.0.0.1",
        port: 8000
    },
    () => {

        console.log(
            "Connected to Mini Redis"
        );

        send("PING");
    }
);


function send(...args) {

    let command =
        `*${args.length}\r\n`;

    for (const arg of args) {

        command +=
            `$${Buffer.byteLength(arg)}\r\n`;

        command +=
            `${arg}\r\n`;
    }

    console.log(
        "Sending:",
        args
    );

    client.write(command);
}


let testNumber = 0;


client.on("data", (data) => {

    console.log(
        "Response:",
        data.toString()
    );


    testNumber++;


    switch (testNumber) {

        case 1:
            send("ECHO", "Hello Redis");
            break;

        case 2:
            send("SET", "name", "Apoorv");
            break;

        case 3:
            send("GET", "name");
            break;

        case 4:
            send("EXISTS", "name");
            break;

        case 5:
            send("SET", "counter", "10");
            break;

        case 6:
            send("INCR", "counter");
            break;

        case 7:
            send("DECR", "counter");
            break;

        case 8:
            send("TYPE", "name");
            break;

        case 9:
            send("DBSIZE");
            break;

        case 10:
            send("KEYS", "*");
            break;

        case 11:
            send("DEL", "name");
            break;

        case 12:
            send("GET", "name");
            break;

        default:
            client.end();
    }
});


client.on("error", (error) => {

    console.error(
        "Client error:",
        error.message
    );
});


client.on("close", () => {

    console.log(
        "Connection closed"
    );
});