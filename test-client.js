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
            "SADD",
            "skills",
            "Python",
            "Redis",
            "Node"
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

        // ============================
        // Add duplicate member test
        // ============================

        case 1:

            send(
                "SADD",
                "skills",
                "Python",
                "JavaScript"
            );

            break;


        // ============================
        // Get all members
        // ============================

        case 2:

            send(
                "SMEMBERS",
                "skills"
            );

            break;


        // ============================
        // Check member exists
        // ============================

        case 3:

            send(
                "SISMEMBER",
                "skills",
                "Redis"
            );

            break;


        // ============================
        // Check missing member
        // ============================

        case 4:

            send(
                "SISMEMBER",
                "skills",
                "Java"
            );

            break;


        // ============================
        // Count members
        // ============================

        case 5:

            send(
                "SCARD",
                "skills"
            );

            break;


        // ============================
        // Remove member
        // ============================

        case 6:

            send(
                "SREM",
                "skills",
                "Node"
            );

            break;


        // ============================
        // Check again
        // ============================

        case 7:

            send(
                "SMEMBERS",
                "skills"
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