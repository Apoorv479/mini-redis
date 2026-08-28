const {
    errorResponse,
    integerResponse
} = require("../protocol/resp-response");


function expireCommand(
    db,
    args
) {

    if (args.length !== 3) {
        return errorResponse(
            "ERR wrong number of arguments for EXPIRE"
        );
    }

    const seconds =
        Number(args[2]);


    if (
        !Number.isInteger(seconds)
    ) {
        return errorResponse(
            "ERR value is not an integer or out of range"
        );
    }


    const success =
        db.expire(
            args[1],
            seconds * 1000
        );


    return integerResponse(
        success ? 1 : 0
    );
}


function pexpireCommand(
    db,
    args
) {

    if (args.length !== 3) {
        return errorResponse(
            "ERR wrong number of arguments for PEXPIRE"
        );
    }

    const milliseconds =
        Number(args[2]);


    if (
        !Number.isInteger(milliseconds)
    ) {
        return errorResponse(
            "ERR value is not an integer or out of range"
        );
    }


    const success =
        db.expire(
            args[1],
            milliseconds
        );


    return integerResponse(
        success ? 1 : 0
    );
}


function ttlCommand(
    db,
    args
) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for TTL"
        );
    }

    return integerResponse(
        db.ttl(args[1])
    );
}


function pttlCommand(
    db,
    args
) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for PTTL"
        );
    }

    return integerResponse(
        db.pttl(args[1])
    );
}


function persistCommand(
    db,
    args
) {

    if (args.length !== 2) {
        return errorResponse(
            "ERR wrong number of arguments for PERSIST"
        );
    }

    return integerResponse(
        db.persist(args[1])
            ? 1
            : 0
    );
}


module.exports = {
    expireCommand,
    pexpireCommand,
    ttlCommand,
    pttlCommand,
    persistCommand
};