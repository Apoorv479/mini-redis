const {
    errorResponse
} = require("../protocol/resp-response");

const {
    setCommand,
    getCommand
} = require("./string");


function executeCommand(db, command) {

    if (!command || command.length === 0) {
        return errorResponse(
            "ERR empty command"
        );
    }

    const operation =
        command[0].toUpperCase();


    switch (operation) {

        case "SET":
            return setCommand(
                db,
                command
            );

        case "GET":
            return getCommand(
                db,
                command
            );

        default:
            return errorResponse(
                `ERR unknown command '${command[0]}'`
            );
    }
}


module.exports = {
    executeCommand
};