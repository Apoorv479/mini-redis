const {
    simpleString,
    errorResponse,
    integerResponse,
    bulkString,
    arrayResponse
} = require("../protocol/resp-response");

const {
    setCommand,
    getCommand,
    incrCommand,
    decrCommand
} = require("./string");

const {
    expireCommand,
    pexpireCommand,
    ttlCommand,
    pttlCommand,
    persistCommand
} = require("./ttl");

const {
    lpushCommand,
    rpushCommand,
    lpopCommand,
    rpopCommand,
    llenCommand,
    lrangeCommand
} = require("./list");

const {
    saddCommand,
    sremCommand,
    smembersCommand,
    sismemberCommand,
    scardCommand
} = require("./set");

const {
    hsetCommand,
    hgetCommand,
    hgetallCommand,
    hdelCommand,
    hlenCommand
} = require("./hash");


function executeCommand(db, command) {

    if (
        !command ||
        command.length === 0
    ) {
        return errorResponse(
            "ERR empty command"
        );
    }


    const operation =
        command[0].toUpperCase();


    switch (operation) {

       
        // PING
       

        case "PING":

            if (command.length === 1) {
                return simpleString("PONG");
            }

            if (command.length === 2) {
                return bulkString(
                    command[1]
                );
            }

            return errorResponse(
                "ERR wrong number of arguments for PING"
            );


       
        // ECHO
       

        case "ECHO":

            if (command.length !== 2) {
                return errorResponse(
                    "ERR wrong number of arguments for ECHO"
                );
            }

            return bulkString(
                command[1]
            );


       
        // SET
       

        case "SET":

            return setCommand(
                db,
                command
            );


       
        // GET
       

        case "GET":

            return getCommand(
                db,
                command
            );


       
        // DEL
       

        case "DEL": {

            if (command.length < 2) {
                return errorResponse(
                    "ERR wrong number of arguments for DEL"
                );
            }

            let deleted = 0;

            for (
                const key of command.slice(1)
            ) {

                if (db.delete(key)) {
                    deleted++;
                }
            }

            return integerResponse(
                deleted
            );
        }


       
        // EXISTS
       

        case "EXISTS": {

            if (command.length < 2) {
                return errorResponse(
                    "ERR wrong number of arguments for EXISTS"
                );
            }

            let count = 0;

            for (
                const key of command.slice(1)
            ) {

                if (db.has(key)) {
                    count++;
                }
            }

            return integerResponse(
                count
            );
        }


       
        // INCR
       

        case "INCR":

            return incrCommand(
                db,
                command
            );


       
        // DECR
       

        case "DECR":

            return decrCommand(
                db,
                command
            );

case "EXPIRE":

    return expireCommand(
        db,
        command
    );


case "PEXPIRE":

    return pexpireCommand(
        db,
        command
    );


case "TTL":

    return ttlCommand(
        db,
        command
    );


case "PTTL":

    return pttlCommand(
        db,
        command
    );


case "PERSIST":

    return persistCommand(
        db,
        command
    );

    
       
        // TYPE
       

        case "TYPE": {

            if (command.length !== 2) {
                return errorResponse(
                    "ERR wrong number of arguments for TYPE"
                );
            }

            const value =
                db.get(command[1]);

            if (value === undefined) {
                return simpleString(
                    "none"
                );
            }

            return simpleString(
                "string"
            );
        }


       
        // DBSIZE
       

        case "DBSIZE":

            if (command.length !== 1) {
                return errorResponse(
                    "ERR wrong number of arguments for DBSIZE"
                );
            }

            return integerResponse(
                db.size()
            );

case "LPUSH":

    return lpushCommand(
        db,
        command
    );


case "RPUSH":

    return rpushCommand(
        db,
        command
    );


case "LPOP":

    return lpopCommand(
        db,
        command
    );


case "RPOP":

    return rpopCommand(
        db,
        command
    );


case "LLEN":

    return llenCommand(
        db,
        command
    );


case "LRANGE":

    return lrangeCommand(
        db,
        command
    );

    
// SET COMMANDS


case "SADD":

    return saddCommand(
        db,
        command
    );


case "SREM":

    return sremCommand(
        db,
        command
    );


case "SMEMBERS":

    return smembersCommand(
        db,
        command
    );


case "SISMEMBER":

    return sismemberCommand(
        db,
        command
    );


case "SCARD":

    return scardCommand(
        db,
        command
    );

// HASH COMMANDS


case "HSET":

    return hsetCommand(
        db,
        command
    );


case "HGET":

    return hgetCommand(
        db,
        command
    );


case "HGETALL":

    return hgetallCommand(
        db,
        command
    );


case "HDEL":

    return hdelCommand(
        db,
        command
    );


case "HLEN":

    return hlenCommand(
        db,
        command
    );

       
        // KEYS
       

        case "KEYS": {

            if (command.length !== 2) {
                return errorResponse(
                    "ERR wrong number of arguments for KEYS"
                );
            }

            const pattern =
                command[1];

            const keys =
                db.keys();


            // Basic implementation:
            // KEYS *
            if (pattern === "*") {
                return arrayResponse(keys);
            }


            // Exact key lookup
            if (
                db.has(pattern)
            ) {
                return arrayResponse([
                    pattern
                ]);
            }


            return arrayResponse([]);
        }


       
        // Unknown command
       

        default:

            return errorResponse(
                `ERR unknown command '${command[0]}'`
            );
    }
}


module.exports = {
    executeCommand
};