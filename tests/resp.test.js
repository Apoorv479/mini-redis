const test = require("node:test");
const assert = require("node:assert/strict");

const RESPParser = require("../src/protocol/resp-parser");


test("parses a simple RESP command", () => {

    let parsedCommand = null;

    const parser = new RESPParser(
        (command) => {
            parsedCommand = command;
        }
    );

    const input =
        "*2\r\n" +
        "$4\r\n" +
        "ECHO\r\n" +
        "$5\r\n" +
        "Hello\r\n";

    parser.feed(
        Buffer.from(input)
    );

    assert.deepEqual(
        parsedCommand,
        ["ECHO", "Hello"]
    );
});


test("parses SET command", () => {

    let parsedCommand = null;

    const parser = new RESPParser(
        (command) => {
            parsedCommand = command;
        }
    );

    const input =
        "*3\r\n" +
        "$3\r\n" +
        "SET\r\n" +
        "$4\r\n" +
        "name\r\n" +
        "$6\r\n" +
        "Apoorv\r\n";

    parser.feed(
        Buffer.from(input)
    );

    assert.deepEqual(
        parsedCommand,
        [
            "SET",
            "name",
            "Apoorv"
        ]
    );
});


test("handles incomplete RESP data", () => {

    let parsedCommand = null;

    const parser = new RESPParser(
        (command) => {
            parsedCommand = command;
        }
    );

    parser.feed(
        Buffer.from(
            "*2\r\n$4\r\nECHO\r\n"
        )
    );

    assert.equal(
        parsedCommand,
        null
    );


    parser.feed(
        Buffer.from(
            "$5\r\nHello\r\n"
        )
    );

    assert.deepEqual(
        parsedCommand,
        [
            "ECHO",
            "Hello"
        ]
    );
});