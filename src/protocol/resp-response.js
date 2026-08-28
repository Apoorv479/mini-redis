function simpleString(value) {
    return `+${value}\r\n`;
}

function errorResponse(message) {
    return `-${message}\r\n`;
}

function integerResponse(value) {
    return `:${value}\r\n`;
}

function bulkString(value) {
    if (value === null || value === undefined) {
        return "$-1\r\n";
    }

    const stringValue = String(value);

    return `$${Buffer.byteLength(stringValue)}\r\n${stringValue}\r\n`;
}

function arrayResponse(items) {
    let response = `*${items.length}\r\n`;

    for (const item of items) {
        response += bulkString(item);
    }

    return response;
}

module.exports = {
    simpleString,
    errorResponse,
    integerResponse,
    bulkString,
    arrayResponse
};