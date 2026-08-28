const net = require("net");

const RESPParser = require("./protocol/resp-parser");
const Database = require("./storage/database");
const { executeCommand } = require("./commands");

const HOST = "127.0.0.1";
const PORT = 8000;

const db = new Database();

const server = net.createServer((connection) => {
    console.log("Client connected");

    const parser = new RESPParser((command) => {
        console.log("Parsed command:", command);

        const response = executeCommand(
            db,
            command
        );

        connection.write(response);
    });

    connection.on("data", (data) => {
        console.log("Raw data:");
        console.log(data.toString());

        try {
            parser.feed(data);
        } catch (error) {
            console.error(
                "Protocol error:",
                error.message
            );

            connection.write(
                `-ERR ${error.message}\r\n`
            );
        }
    });

    connection.on("error", (error) => {
        console.error(
            "Connection error:",
            error.message
        );
    });

    connection.on("close", () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, HOST, () => {
    console.log(
        `Mini Redis running on ${HOST}:${PORT}`
    );
});