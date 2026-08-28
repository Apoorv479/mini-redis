const test = require("node:test");
const assert = require("node:assert/strict");

const Database =
    require("../src/storage/database");

const {
    hsetCommand,
    hgetCommand,
    hgetallCommand,
    hdelCommand,
    hlenCommand
} = require("../src/commands/hash");


test("HSET creates hash fields", () => {

    const db = new Database();

    const response =
        hsetCommand(
            db,
            [
                "HSET",
                "user",
                "name",
                "Apoorv",
                "age",
                "24"
            ]
        );

    assert.equal(
        response,
        ":2\r\n"
    );

    assert.equal(
        db.get("user").get("name"),
        "Apoorv"
    );
});


test("HGET returns field value", () => {

    const db = new Database();

    hsetCommand(
        db,
        [
            "HSET",
            "user",
            "name",
            "Apoorv"
        ]
    );

    const response =
        hgetCommand(
            db,
            [
                "HGET",
                "user",
                "name"
            ]
        );

    assert.equal(
        response,
        "$6\r\nApoorv\r\n"
    );
});


test("HGET returns NULL for missing field", () => {

    const db = new Database();

    const response =
        hgetCommand(
            db,
            [
                "HGET",
                "user",
                "name"
            ]
        );

    assert.equal(
        response,
        "$-1\r\n"
    );
});


test("HGETALL returns fields and values", () => {

    const db = new Database();

    hsetCommand(
        db,
        [
            "HSET",
            "user",
            "name",
            "Apoorv",
            "age",
            "24"
        ]
    );

    const response =
        hgetallCommand(
            db,
            [
                "HGETALL",
                "user"
            ]
        );

    assert.equal(
        response,
        "*4\r\n" +
        "$4\r\nname\r\n" +
        "$6\r\nApoorv\r\n" +
        "$3\r\nage\r\n" +
        "$2\r\n24\r\n"
    );
});


test("HLEN returns number of fields", () => {

    const db = new Database();

    hsetCommand(
        db,
        [
            "HSET",
            "user",
            "name",
            "Apoorv",
            "age",
            "24"
        ]
    );

    const response =
        hlenCommand(
            db,
            [
                "HLEN",
                "user"
            ]
        );

    assert.equal(
        response,
        ":2\r\n"
    );
});


test("HDEL removes field", () => {

    const db = new Database();

    hsetCommand(
        db,
        [
            "HSET",
            "user",
            "name",
            "Apoorv",
            "age",
            "24"
        ]
    );

    const response =
        hdelCommand(
            db,
            [
                "HDEL",
                "user",
                "age"
            ]
        );

    assert.equal(
        response,
        ":1\r\n"
    );

    assert.equal(
        db.get("user").has("age"),
        false
    );
});