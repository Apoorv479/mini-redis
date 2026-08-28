class RESPParser {
    constructor(onCommand) {
        this.buffer = Buffer.alloc(0);
        this.onCommand = onCommand;
    }

    feed(data) {
        this.buffer = Buffer.concat([
            this.buffer,
            data
        ]);

        while (true) {
            const result = this.parse();

            if (!result) {
                break;
            }

            this.buffer = this.buffer.subarray(
                result.consumed
            );

            this.onCommand(result.command);
        }
    }

    parse() {
        if (this.buffer.length === 0) {
            return null;
        }

        // RESP Array starts with *
        if (this.buffer[0] !== 0x2a) {
            throw new Error(
                "Invalid RESP command"
            );
        }

        // Find first \r\n
        const firstLineEnd = this.findCRLF(1);

        if (firstLineEnd === -1) {
            return null;
        }

        // Example:
        // *3\r\n
        //
        // count = 3
        const count = Number(
            this.buffer
                .subarray(1, firstLineEnd)
                .toString()
        );

        if (!Number.isInteger(count)) {
            throw new Error(
                "Invalid RESP array length"
            );
        }

        let position = firstLineEnd + 2;

        const command = [];

        for (let i = 0; i < count; i++) {

            // Every element should start with $
            if (
                position >= this.buffer.length
            ) {
                return null;
            }

            if (this.buffer[position] !== 0x24) {
                throw new Error(
                    "Expected RESP bulk string"
                );
            }

            // Find length line
            const lengthEnd =
                this.findCRLF(position + 1);

            if (lengthEnd === -1) {
                return null;
            }

            const length = Number(
                this.buffer
                    .subarray(
                        position + 1,
                        lengthEnd
                    )
                    .toString()
            );

            if (!Number.isInteger(length)) {
                throw new Error(
                    "Invalid bulk string length"
                );
            }

            const dataStart = lengthEnd + 2;

            const dataEnd =
                dataStart + length;

            // Complete data received nahi hua
            if (
                this.buffer.length <
                dataEnd + 2
            ) {
                return null;
            }

            // Check \r\n
            if (
                this.buffer[dataEnd] !== 0x0d ||
                this.buffer[dataEnd + 1] !== 0x0a
            ) {
                throw new Error(
                    "Invalid RESP terminator"
                );
            }

            const value =
                this.buffer
                    .subarray(
                        dataStart,
                        dataEnd
                    )
                    .toString();

            command.push(value);

            position = dataEnd + 2;
        }

        return {
            command,
            consumed: position
        };
    }

    findCRLF(start) {
        for (
            let i = start;
            i < this.buffer.length - 1;
            i++
        ) {
            if (
                this.buffer[i] === 0x0d &&
                this.buffer[i + 1] === 0x0a
            ) {
                return i;
            }
        }

        return -1;
    }
}

module.exports = RESPParser;