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
            "SET",
            "session",
            "abc",
            "EX",
            "5"
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


    if (step === 1) {

        // Check TTL
        send(
            "TTL",
            "session"
        );

    } else if (step === 2) {

        // Check value
        send(
            "GET",
            "session"
        );

    } else if (step === 3) {

        console.log(
            "Waiting 6 seconds..."
        );

        setTimeout(() => {

            send(
                "GET",
                "session"
            );

        }, 6000);

    } else {

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