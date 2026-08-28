const {
    errorResponse,
    integerResponse,
    arrayResponse
} = require("../protocol/resp-response");



// Get existing set or create new set


function getOrCreateSet(db, key) {

    const existing = db.getEntry(key);

    if (!existing) {

        db.setEntry(
            key,
            "set",
            new Set(),
            null
        );

        return db.getEntry(key);
    }

    if (existing.type !== "set") {
        return null;
    }

    return existing;
}



// SADD


function saddCommand(db, args) {

    if (args.length < 3) {
        return errorResponse(
            "ERR wrong number of arguments for SADD"
        );
    }

    const key = args[1];

    const entry =
        getOrCreateSet(
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
        i++
    ) {

        const member = args[i];

        if (!entry.value.has(member)) {

            entry.value.add(member);

            added++;
        }
    }

    return integerResponse(
        added
    );
}



// SREM


function sremCommand(db, args) {

    if (args.length < 3) {
        return errorResponse(
            "ERR wrong number of arguments for SREM"
        );
    }

    const key = args[1];

    const entry =
        db.getEntry(key);

    if (!entry) {
        return integerResponse(0);
    }

    if (entry.type !== "set") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    let removed = 0;

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
            removed++;
        }
    }

    // Redis deletes the key
    // when the set becomes empty.
    if (entry.value.size === 0) {
        db.delete(key);
    }

    return integerResponse(
        removed
    );
}



// SMEMBERS


function smembersCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for SMEMBERS"
        );
    }

    const key = args[1];

    const entry =
        db.getEntry(key);

    if (!entry) {
        return arrayResponse([]);
    }

    if (entry.type !== "set") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    return arrayResponse(
        [...entry.value]
    );
}



// SISMEMBER


function sismemberCommand(db, args) {

    if (args.length !== 3) {
        return errorResponse(
            "ERR wrong number of arguments for SISMEMBER"
        );
    }

    const key = args[1];
    const member = args[2];

    const entry =
        db.getEntry(key);

    if (!entry) {
        return integerResponse(0);
    }

    if (entry.type !== "set") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    return integerResponse(
        entry.value.has(member)
            ? 1
            : 0
    );
}



// SCARD


function scardCommand(db, args) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for SCARD"
        );
    }

    const key = args[1];

    const entry =
        db.getEntry(key);

    if (!entry) {
        return integerResponse(0);
    }

    if (entry.type !== "set") {
        return errorResponse(
            "WRONGTYPE Operation against a key holding the wrong kind of value"
        );
    }

    return integerResponse(
        entry.value.size
    );
}


module.exports = {
    saddCommand,
    sremCommand,
    smembersCommand,
    sismemberCommand,
    scardCommand
};