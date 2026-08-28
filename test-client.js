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
            "LPUSH",
            "tasks",
            "task1"
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
                "RPUSH",
                "tasks",
                "task2",
                "task3"
            );

            break;


        case 2:

            send(
                "LRANGE",
                "tasks",
                "0",
                "-1"
            );

            break;


        case 3:

            send(
                "LLEN",
                "tasks"
            );

            break;


        case 4:

            send(
                "LPOP",
                "tasks"
            );

            break;


        case 5:

            send(
                "RPOP",
                "tasks"
            );

            break;


        case 6:

            send(
                "LRANGE",
                "tasks",
                "0",
                "-1"
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