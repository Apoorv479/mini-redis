const {
    simpleString,
    errorResponse,
    bulkString
} = require("../protocol/resp-response");


function setCommand(db, args) {

    if (args.length !== 3) {
        return errorResponse(
            "ERR wrong number of arguments for SET"
        );
    }

    const key = args[1];
    const value = args[2];

    db.set(key, value);

    return simpleString("OK");
}


function getCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for GET"
        );
    }

    const key = args[1];

    const value = db.get(key);

    // Key doesn't exist
    if (value === undefined) {
        return bulkString(null);
    }

    return bulkString(value);
}


module.exports = {
    setCommand,
    getCommand
};