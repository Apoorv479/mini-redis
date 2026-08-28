const net = require("net");

const RESPParser = require("./protocol/resp-parser");

const PORT = 8000;

const server = net.createServer(
    (connection) => {

        console.log(
            "Client connected"
        );

        const parser = new RESPParser(
            (command) => {

                console.log(
                    "Parsed command:",
                    command
                );

                
            }
        );

        connection.on(
            "data",
            (data) => {

                console.log(
                    "Raw data:"
                );

                console.log(
                    data.toString()
                );

                parser.feed(data);
            }
        );

        connection.on(
            "error",
            (error) => {

                console.error(
                    "Connection error:",
                    error.message
                );
            }
        );

        connection.on(
            "close",
            () => {

                console.log(
                    "Client disconnected"
                );
            }
        );
    }
);

server.listen(
    PORT,
    () => {

        console.log(
            `Mini Redis running on port ${PORT}`
        );
    }
);