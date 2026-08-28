const {
    simpleString,
    errorResponse,
    bulkString,
    integerResponse
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

    if (value === undefined) {
        return bulkString(null);
    }

    return bulkString(value);
}


function incrementCommand(db, args, amount) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments"
        );
    }

    const key = args[1];

    const existingValue = db.get(key);

    // Key doesn't exist
    if (existingValue === undefined) {

        db.set(
            key,
            String(amount)
        );

        return integerResponse(amount);
    }


    // Check integer
    if (!/^-?\d+$/.test(existingValue)) {

        return errorResponse(
            "ERR value is not an integer or out of range"
        );
    }


    const currentValue =
        Number(existingValue);

    const newValue =
        currentValue + amount;


    db.set(
        key,
        String(newValue)
    );


    return integerResponse(newValue);
}


function incrCommand(db, args) {

    return incrementCommand(
        db,
        args,
        1
    );
}


function decrCommand(db, args) {

    return incrementCommand(
        db,
        args,
        -1
    );
}


module.exports = {
    setCommand,
    getCommand,
    incrCommand,
    decrCommand
};