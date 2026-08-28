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

        send(
            "HSET",
            "user",
            "name",
            "Apoorv",
            "age",
            "24",
            "role",
            "engineer"
        );
    }
);


function send(...args) {

    let command =
        `*${args.length}\r\n`;

    for (
        const arg of args
    ) {

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


let step = 0;


client.on("data", (data) => {

    console.log(
        "Response:",
        data.toString()
    );

    step++;


    switch (step) {

        case 1:

            send(
                "HGET",
                "user",
                "name"
            );

            break;


        case 2:

            send(
                "HGET",
                "user",
                "age"
            );

            break;


        case 3:

            send(
                "HGET",
                "user",
                "email"
            );

            break;


        case 4:

            send(
                "HGETALL",
                "user"
            );

            break;


        case 5:

            send(
                "HLEN",
                "user"
            );

            break;


        case 6:

            send(
                "HDEL",
                "user",
                "age"
            );

            break;


        case 7:

            send(
                "HGETALL",
                "user"
            );

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