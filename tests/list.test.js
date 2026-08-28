const test = require("node:test");
const assert = require("node:assert/strict");

const Database =
    require("../src/storage/database");

const {
    lpushCommand,
    rpushCommand,
    lpopCommand,
    rpopCommand,
    llenCommand,
    lrangeCommand
} = require("../src/commands/list");


test("LPUSH adds values to the beginning", () => {

    const db = new Database();

    const response =
        lpushCommand(
            db,
            [
                "LPUSH",
                "tasks",
                "task1",
                "task2"
            ]
        );

    assert.equal(
        response,
        ":2\r\n"
    );

    assert.deepEqual(
        db.get("tasks"),
        [
            "task2",
            "task1"
        ]
    );
});


test("RPUSH adds values to the end", () => {

    const db = new Database();

    lpushCommand(
        db,
        [
            "LPUSH",
            "tasks",
            "task1"
        ]
    );

    const response =
        rpushCommand(
            db,
            [
                "RPUSH",
                "tasks",
                "task2"
            ]
        );

    assert.equal(
        response,
        ":2\r\n"
    );

    assert.deepEqual(
        db.get("tasks"),
        [
            "task1",
            "task2"
        ]
    );
});


test("LRANGE returns list values", () => {

    const db = new Database();

    lpushCommand(
        db,
        [
            "LPUSH",
            "tasks",
            "task1"
        ]
    );

    rpushCommand(
        db,
        [
            "RPUSH",
            "tasks",
            "task2",
            "task3"
        ]
    );

    const response =
        lrangeCommand(
            db,
            [
                "LRANGE",
                "tasks",
                "0",
                "-1"
            ]
        );

    assert.equal(
        response,
        "*3\r\n" +
        "$5\r\ntask1\r\n" +
        "$5\r\ntask2\r\n" +
        "$5\r\ntask3\r\n"
    );
});


test("LLEN returns list length", () => {

    const db = new Database();

    rpushCommand(
        db,
        [
            "RPUSH",
            "tasks",
            "task1",
            "task2"
        ]
    );

    const response =
        llenCommand(
            db,
            [
                "LLEN",
                "tasks"
            ]
        );

    assert.equal(
        response,
        ":2\r\n"
    );
});


test("LPOP removes first element", () => {

    const db = new Database();

    rpushCommand(
        db,
        [
            "RPUSH",
            "tasks",
            "task1",
            "task2"
        ]
    );

    const response =
        lpopCommand(
            db,
            [
                "LPOP",
                "tasks"
            ]
        );

    assert.equal(
        response,
        "$5\r\ntask1\r\n"
    );

    assert.deepEqual(
        db.get("tasks"),
        ["task2"]
    );
});


test("RPOP removes last element", () => {

    const db = new Database();

    rpushCommand(
        db,
        [
            "RPUSH",
            "tasks",
            "task1",
            "task2"
        ]
    );

    const response =
        rpopCommand(
            db,
            [
                "RPOP",
                "tasks"
            ]
        );

    assert.equal(
        response,
        "$5\r\ntask2\r\n"
    );

    assert.deepEqual(
        db.get("tasks"),
        ["task1"]
    );
});