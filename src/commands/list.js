const {
    errorResponse,
    integerResponse,
    bulkString,
    arrayResponse
} = require("../protocol/resp-response");


function getOrCreateList(db, key) {

    const existing =
        db.getEntry(key);

    // Key doesn't exist
    if (!existing) {

        const entry = {
            type: "list",
            value: [],
            expiresAt: null
        };

        db.setEntry(
            key,
            "list",
            [],
            null
        );

        return db.getEntry(key);
    }


    // Existing key is not a list
    if (existing.type !== "list") {
        return null;
    }


    return existing;
}



// LPUSH


function lpushCommand(db, args) {

    if (args.length < 3) {
        return errorResponse(
            "ERR wrong number of arguments for LPUSH"
        );
    }


    const key = args[1];

    const entry =
        getOrCreateList(
            db,
            key
        );


    if (!entry) {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }


    // Values ko list ke beginning mein add karo
    //
    // LPUSH tasks task1 task2
    //
    // Result:
    //
    // [task2, task1]

    for (
        let i = 2;
        i < args.length;
        i++
    ) {
        entry.value.unshift(
            args[i]
        );
    }


    return integerResponse(
        entry.value.length
    );
}



// RPUSH


function rpushCommand(db, args) {

    if (args.length < 3) {
        return errorResponse(
            "ERR wrong number of arguments for RPUSH"
        );
    }


    const key = args[1];

    const entry =
        getOrCreateList(
            db,
            key
        );


    if (!entry) {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }


    for (
        let i = 2;
        i < args.length;
        i++
    ) {
        entry.value.push(
            args[i]
        );
    }


    return integerResponse(
        entry.value.length
    );
}



// LPOP


function lpopCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for LPOP"
        );
    }


    const key = args[1];

    const entry =
        db.getEntry(key);


    if (!entry) {
        return bulkString(null);
    }


    if (entry.type !== "list") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }


    const value =
        entry.value.shift();


    // List empty ho gayi
    if (entry.value.length === 0) {
        db.delete(key);
    }


    return bulkString(
        value
    );
}



// RPOP


function rpopCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for RPOP"
        );
    }


    const key = args[1];

    const entry =
        db.getEntry(key);


    if (!entry) {
        return bulkString(null);
    }


    if (entry.type !== "list") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }


    const value =
        entry.value.pop();


    if (entry.value.length === 0) {
        db.delete(key);
    }


    return bulkString(
        value
    );
}



// LLEN


function llenCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for LLEN"
        );
    }


    const key = args[1];

    const entry =
        db.getEntry(key);


    if (!entry) {
        return integerResponse(0);
    }


    if (entry.type !== "list") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }


    return integerResponse(
        entry.value.length
    );
}



// LRANGE


function lrangeCommand(db, args) {

    if (args.length !== 4) {
        return errorResponse(
            "ERR wrong number of arguments for LRANGE"
        );
    }


    const key = args[1];

    const entry =
        db.getEntry(key);


    if (!entry) {
        return arrayResponse([]);
    }


    if (entry.type !== "list") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }


    let start =
        Number(args[2]);

    let stop =
        Number(args[3]);


    if (
        !Number.isInteger(start) ||
        !Number.isInteger(stop)
    ) {
        return errorResponse(
            "ERR value is not an integer"
        );
    }


    const length =
        entry.value.length;


    // Negative indexes
    if (start < 0) {
        start =
            length + start;
    }

    if (stop < 0) {
        stop =
            length + stop;
    }


    // Bounds
    if (start < 0) {
        start = 0;
    }

    if (stop >= length) {
        stop =
            length - 1;
    }


    if (
        start > stop ||
        start >= length
    ) {
        return arrayResponse([]);
    }


    const result =
        entry.value.slice(
            start,
            stop + 1
        );


    return arrayResponse(
        result
    );
}


module.exports = {
    lpushCommand,
    rpushCommand,
    lpopCommand,
    rpopCommand,
    llenCommand,
    lrangeCommand
};