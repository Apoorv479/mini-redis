const test = require("node:test");
const assert = require("node:assert/strict");

const Database =
    require("../src/storage/database");

const {
    setCommand,
    getCommand
} = require("../src/commands/string");

const {
    expireCommand,
    ttlCommand,
    pttlCommand,
    persistCommand
} = require("../src/commands/ttl");


test("EXPIRE sets expiration", () => {

    const db = new Database();

    setCommand(
        db,
        [
            "SET",
            "session",
            "abc"
        ]
    );

    const response =
        expireCommand(
            db,
            [
                "EXPIRE",
                "session",
                "10"
            ]
        );

    assert.equal(
        response,
        ":1\r\n"
    );

    assert.ok(
        db.ttl("session") >= 9
    );
});


test("TTL returns -1 for persistent key", () => {

    const db = new Database();

    setCommand(
        db,
        [
            "SET",
            "name",
            "Apoorv"
        ]
    );

    const response =
        ttlCommand(
            db,
            [
                "TTL",
                "name"
            ]
        );

    assert.equal(
        response,
        ":-1\r\n"
    );
});


test("TTL returns -2 for missing key", () => {

    const db = new Database();

    const response =
        ttlCommand(
            db,
            [
                "TTL",
                "missing"
            ]
        );

    assert.equal(
        response,
        ":-2\r\n"
    );
});


test("PERSIST removes expiration", () => {

    const db = new Database();

    setCommand(
        db,
        [
            "SET",
            "session",
            "abc",
            "EX",
            "10"
        ]
    );

    const response =
        persistCommand(
            db,
            [
                "PERSIST",
                "session"
            ]
        );

    assert.equal(
        response,
        ":1\r\n"
    );

    assert.equal(
        db.ttl("session"),
        -1
    );
});


test("expired key becomes unavailable", async () => {

    const db = new Database();

    setCommand(
        db,
        [
            "SET",
            "session",
            "abc",
            "PX",
            "50"
        ]
    );

    assert.equal(
        db.get("session"),
        "abc"
    );

    await new Promise(
        resolve => setTimeout(
            resolve,
            75
        )
    );

    assert.equal(
        db.get("session"),
        undefined
    );
});