const {
    errorResponse,
    integerResponse,
    bulkString,
    arrayResponse
} = require("../protocol/resp-response");



// Get existing hash or create new hash


function getOrCreateHash(db, key) {

    const existing = db.getEntry(key);

    if (!existing) {

        db.setEntry(
            key,
            "hash",
            new Map(),
            null
        );

        return db.getEntry(key);
    }

    if (existing.type !== "hash") {
        return null;
    }

    return existing;
}



// HSET


function hsetCommand(db, args) {

    if (args.length < 4 || args.length % 2 !== 0) {
        return errorResponse(
            "ERR wrong number of arguments for HSET"
        );
    }

    const key = args[1];

    const entry =
        getOrCreateHash(
            db,
            key
        );

    if (!entry) {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    let added = 0;

    for (
        let i = 2;
        i < args.length;
        i += 2
    ) {

        const field = args[i];
        const value = args[i + 1];

        if (!entry.value.has(field)) {
            added++;
        }

        entry.value.set(
            field,
            value
        );
    }

    return integerResponse(
        added
    );
}



// HGET


function hgetCommand(db, args) {

    if (args.length !== 3) {
        return errorResponse(
            "ERR wrong number of arguments for HGET"
        );
    }

    const key = args[1];
    const field = args[2];

    const entry =
        db.getEntry(key);

    if (!entry) {
        return bulkString(null);
    }

    if (entry.type !== "hash") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    if (!entry.value.has(field)) {
        return bulkString(null);
    }

    return bulkString(
        entry.value.get(field)
    );
}



// HGETALL


function hgetallCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for HGETALL"
        );
    }

    const key = args[1];

    const entry =
        db.getEntry(key);

    if (!entry) {
        return arrayResponse([]);
    }

    if (entry.type !== "hash") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    const result = [];

    for (
        const [field, value]
        of entry.value
    ) {

        result.push(field);
        result.push(value);
    }

    return arrayResponse(
        result
    );
}



// HDEL


function hdelCommand(db, args) {

    if (args.length < 3) {
        return errorResponse(
            "ERR wrong number of arguments for HDEL"
        );
    }

    const key = args[1];

    const entry =
        db.getEntry(key);

    if (!entry) {
        return integerResponse(0);
    }

    if (entry.type !== "hash") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    let deleted = 0;

    for (
        let i = 2;
        i < args.length;
        i++
    ) {

        if (
            entry.value.delete(
                args[i]
            )
        ) {
            deleted++;
        }
    }

    if (entry.value.size === 0) {
        db.delete(key);
    }

    return integerResponse(
        deleted
    );
}



// HLEN


function hlenCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for HLEN"
        );
    }

    const key = args[1];

    const entry =
        db.getEntry(key);

    if (!entry) {
        return integerResponse(0);
    }

    if (entry.type !== "hash") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    return integerResponse(
        entry.value.size
    );
}


module.exports = {
    hsetCommand,
    hgetCommand,
    hgetallCommand,
    hdelCommand,
    hlenCommand
};