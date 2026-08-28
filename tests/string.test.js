const test = require("node:test");
const assert = require("node:assert/strict");

const Database =
    require("../src/storage/database");

const {
    setCommand,
    getCommand,
    incrCommand,
    decrCommand
} = require("../src/commands/string");


test("SET stores a value", () => {

    const db = new Database();

    const response =
        setCommand(
            db,
            [
                "SET",
                "name",
                "Apoorv"
            ]
        );

    assert.equal(
        response,
        "+OK\r\n"
    );

    assert.equal(
        db.get("name"),
        "Apoorv"
    );
});


test("GET returns stored value", () => {

    const db = new Database();

    db.set(
        "name",
        "Apoorv"
    );

    const response =
        getCommand(
            db,
            [
                "GET",
                "name"
            ]
        );

    assert.equal(
        response,
        "$6\r\nApoorv\r\n"
    );
});


test("GET returns NULL for missing key", () => {

    const db = new Database();

    const response =
        getCommand(
            db,
            [
                "GET",
                "missing"
            ]
        );

    assert.equal(
        response,
        "$-1\r\n"
    );
});


test("INCR increments integer value", () => {

    const db = new Database();

    db.set(
        "counter",
        "10"
    );

    const response =
        incrCommand(
            db,
            [
                "INCR",
                "counter"
            ]
        );

    assert.equal(
        response,
        ":11\r\n"
    );

    assert.equal(
        db.get("counter"),
        "11"
    );
});


test("DECR decrements integer value", () => {

    const db = new Database();

    db.set(
        "counter",
        "10"
    );

    const response =
        decrCommand(
            db,
            [
                "DECR",
                "counter"
            ]
        );

    assert.equal(
        response,
        ":9\r\n"
    );
});


test("INCR rejects non-integer values", () => {

    const db = new Database();

    db.set(
        "name",
        "Apoorv"
    );

    const response =
        incrCommand(
            db,
            [
                "INCR",
                "name"
            ]
        );

    assert.match(
        response,
        /^-ERR/
    );
});