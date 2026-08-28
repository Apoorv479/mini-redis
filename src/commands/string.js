const {
    simpleString,
    errorResponse,
    bulkString,
    integerResponse
} = require("../protocol/resp-response");


function setCommand(db, args) {

    if (args.length < 3) {
        return errorResponse(
            "ERR wrong number of arguments for SET"
        );
    }

    const key = args[1];
    const value = args[2];

    let expiresAt = null;

    let i = 3;

    while (i < args.length) {

        const option =
            args[i].toUpperCase();


        // ==============================
        // EX seconds
        // ==============================

        if (option === "EX") {

            if (i + 1 >= args.length) {
                return errorResponse(
                    "ERR syntax error"
                );
            }

            const seconds =
                Number(args[i + 1]);

            if (
                !Number.isInteger(seconds) ||
                seconds <= 0
            ) {
                return errorResponse(
                    "ERR invalid expire time"
                );
            }

            expiresAt =
                Date.now() +
                seconds * 1000;

            i += 2;

            continue;
        }


        // ==============================
        // PX milliseconds
        // ==============================

        if (option === "PX") {

            if (i + 1 >= args.length) {
                return errorResponse(
                    "ERR syntax error"
                );
            }

            const milliseconds =
                Number(args[i + 1]);

            if (
                !Number.isInteger(milliseconds) ||
                milliseconds <= 0
            ) {
                return errorResponse(
                    "ERR invalid expire time"
                );
            }

            expiresAt =
                Date.now() +
                milliseconds;

            i += 2;

            continue;
        }


        return errorResponse(
            "ERR syntax error"
        );
    }


    db.set(
        key,
        value,
        expiresAt
    );


    return simpleString("OK");
}


function getCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for GET"
        );
    }

    const key = args[1];

    const value =
        db.get(key);


    if (value === undefined) {
        return bulkString(null);
    }


    return bulkString(value);
}


function incrementCommand(
    db,
    args,
    amount
) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments"
        );
    }

    const key = args[1];

    const existingValue =
        db.get(key);


    if (existingValue === undefined) {

        db.set(
            key,
            String(amount)
        );

        return integerResponse(
            amount
        );
    }


    if (
        !/^-?\d+$/.test(
            existingValue
        )
    ) {
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


    return integerResponse(
        newValue
    );
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