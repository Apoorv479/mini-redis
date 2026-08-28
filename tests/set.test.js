const test = require("node:test");
const assert = require("node:assert/strict");

const Database =
    require("../src/storage/database");

const {
    saddCommand,
    sremCommand,
    smembersCommand,
    sismemberCommand,
    scardCommand
} = require("../src/commands/set");


test("SADD adds unique members", () => {

    const db = new Database();

    const response =
        saddCommand(
            db,
            [
                "SADD",
                "skills",
                "Python",
                "Redis",
                "Python"
            ]
        );

    assert.equal(
        response,
        ":2\r\n"
    );

    assert.equal(
        db.get("skills").size,
        2
    );
});


test("SISMEMBER checks membership", () => {

    const db = new Database();

    saddCommand(
        db,
        [
            "SADD",
            "skills",
            "Python"
        ]
    );

    const exists =
        sismemberCommand(
            db,
            [
                "SISMEMBER",
                "skills",
                "Python"
            ]
        );

    const missing =
        sismemberCommand(
            db,
            [
                "SISMEMBER",
                "skills",
                "Java"
            ]
        );

    assert.equal(
        exists,
        ":1\r\n"
    );

    assert.equal(
        missing,
        ":0\r\n"
    );
});


test("SCARD returns set size", () => {

    const db = new Database();

    saddCommand(
        db,
        [
            "SADD",
            "skills",
            "Python",
            "Redis",
            "Node"
        ]
    );

    const response =
        scardCommand(
            db,
            [
                "SCARD",
                "skills"
            ]
        );

    assert.equal(
        response,
        ":3\r\n"
    );
});


test("SREM removes members", () => {

    const db = new Database();

    saddCommand(
        db,
        [
            "SADD",
            "skills",
            "Python",
            "Redis"
        ]
    );

    const response =
        sremCommand(
            db,
            [
                "SREM",
                "skills",
                "Redis"
            ]
        );

    assert.equal(
        response,
        ":1\r\n"
    );

    assert.equal(
        db.get("skills").has("Redis"),
        false
    );
});


test("SMEMBERS returns all members", () => {

    const db = new Database();

    saddCommand(
        db,
        [
            "SADD",
            "skills",
            "Python",
            "Redis"
        ]
    );

    const response =
        smembersCommand(
            db,
            [
                "SMEMBERS",
                "skills"
            ]
        );

    assert.equal(
        response,
        "*2\r\n" +
        "$6\r\nPython\r\n" +
        "$5\r\nRedis\r\n"
    );
});