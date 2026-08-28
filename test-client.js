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

        testSet();
    }
);



// SET


function testSet() {

    console.log(
        "\n--- SET TEST ---"
    );

    const command =
        "*3\r\n" +
        "$3\r\n" +
        "SET\r\n" +
        "$4\r\n" +
        "name\r\n" +
        "$6\r\n" +
        "Apoorv\r\n";

    client.write(command);
}



// GET existing key


function testGetExisting() {

    console.log(
        "\n--- GET EXISTING KEY ---"
    );

    const command =
        "*2\r\n" +
        "$3\r\n" +
        "GET\r\n" +
        "$4\r\n" +
        "name\r\n";

    client.write(command);
}



// GET missing key


function testGetMissing() {

    console.log(
        "\n--- GET MISSING KEY ---"
    );

    const command =
        "*2\r\n" +
        "$3\r\n" +
        "GET\r\n" +
        "$3\r\n" +
        "age\r\n";

    client.write(command);
}



// Invalid command


function testInvalidCommand() {

    console.log(
        "\n--- INVALID COMMAND ---"
    );

    const command =
        "*2\r\n" +
        "$6\r\n" +
        "DELETE\r\n" +
        "\r\n" +
        "$4\r\n" +
        "name\r\n";

    client.write(command);
}



// Response handler


let step = 0;

client.on("data", (data) => {

    const response =
        data.toString();

    console.log(
        "Server response:"
    );

    console.log(response);

    step++;

    if (step === 1) {

        // SET successful
        testGetExisting();

    } else if (step === 2) {

        // Existing key
        testGetMissing();

    } else if (step === 3) {

        // Missing key
        testInvalidCommand();

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