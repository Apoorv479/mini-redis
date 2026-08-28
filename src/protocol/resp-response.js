function simpleString(value) {
    return `+${value}\r\n`;
}

function errorResponse(message) {
    return `-${message}\r\n`;
}

function bulkString(value) {
    if (value === null || value === undefined) {
        return "$-1\r\n";
    }

    const stringValue = String(value);

    return `$${Buffer.byteLength(stringValue)}\r\n${stringValue}\r\n`;
}

module.exports = {
    simpleString,
    errorResponse,
    bulkString
};