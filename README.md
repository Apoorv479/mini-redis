# Mini Redis

A Redis-inspired in-memory database built from scratch using Node.js, TCP sockets, and the RESP protocol.

The project implements a lightweight Redis-like server with a custom RESP parser, command routing, in-memory storage, key expiration, and multiple Redis data structures.

## Features

* TCP server built with Node.js
* Custom RESP protocol parser
* RESP response encoder
* In-memory key-value storage
* String operations
* Redis-style Lists
* Redis-style Sets
* Redis-style Hashes
* Key expiration and TTL
* Command routing
* Error and NULL responses
* Automated test suite
* Manual TCP integration client

## Architecture

```text
                         Client
                           |
                           | TCP
                           v
                    +--------------+
                    | TCP Server   |
                    +--------------+
                           |
                           v
                    +--------------+
                    | RESP Parser  |
                    +--------------+
                           |
                           v
                    +--------------+
                    | Command      |
                    | Router       |
                    +--------------+
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      Strings           Lists             Sets
          |                |                |
          +----------------+----------------+
                           |
                           v
                        Hashes
                           |
                           v
                    +--------------+
                    |  Database    |
                    |  Storage     |
                    +--------------+
                           |
                           v
                       Map Storage
```

## Project Structure

```text
mini-redis/
│
├── src/
│   ├── server.js
│   │
│   ├── protocol/
│   │   ├── resp-parser.js
│   │   └── resp-response.js
│   │
│   ├── commands/
│   │   ├── index.js
│   │   ├── string.js
│   │   ├── list.js
│   │   ├── set.js
│   │   ├── hash.js
│   │   └── ttl.js
│   │
│   └── storage/
│       └── database.js
│
├── tests/
│   ├── resp.test.js
│   ├── string.test.js
│   ├── list.test.js
│   ├── set.test.js
│   ├── hash.test.js
│   └── ttl.test.js
│
├── test-client.js
├── index.js
├── package.json
├── README.md
├── .gitignore
└── LICENSE
```

## How It Works

### 1. TCP Server

The server listens for TCP connections on:

```text
127.0.0.1:8000
```

Clients communicate with the server through a raw TCP connection.

### 2. RESP Protocol

Redis clients communicate using the Redis Serialization Protocol (RESP).

For example:

```text
*3\r\n
$3\r\n
SET\r\n
$4\r\n
name\r\n
$6\r\n
Apoorv\r\n
```

The custom RESP parser converts this raw protocol data into:

```js
[
    "SET",
    "name",
    "Apoorv"
]
```

### 3. Command Router

The parsed command is passed to the command router.

The router determines which command implementation should handle the request.

```text
SET       -> string.js
GET       -> string.js

LPUSH     -> list.js
LRANGE    -> list.js

SADD      -> set.js
SMEMBERS  -> set.js

HSET      -> hash.js
HGET      -> hash.js

TTL       -> ttl.js
EXPIRE    -> ttl.js
```

### 4. Storage Engine

The database maintains data in memory using JavaScript's `Map`.

Each entry contains:

```js
{
    type,
    value,
    expiresAt
}
```

This allows the same storage layer to support multiple data types.

Example:

```js
{
    type: "string",
    value: "Apoorv",
    expiresAt: null
}
```

A list:

```js
{
    type: "list",
    value: ["task1", "task2"],
    expiresAt: null
}
```

A set:

```js
{
    type: "set",
    value: new Set(["Python", "Redis"]),
    expiresAt: null
}
```

A hash:

```js
{
    type: "hash",
    value: new Map([
        ["name", "Apoorv"],
        ["age", "24"]
    ]),
    expiresAt: null
}
```

## Supported Commands

### General

| Command | Description               |
| ------- | ------------------------- |
| `PING`  | Check server availability |
| `ECHO`  | Return provided message   |

### Strings

| Command | Description             |
| ------- | ----------------------- |
| `SET`   | Store a string value    |
| `GET`   | Retrieve a string value |
| `INCR`  | Increment integer value |
| `DECR`  | Decrement integer value |

### Keys

| Command  | Description              |
| -------- | ------------------------ |
| `DEL`    | Delete keys              |
| `EXISTS` | Check whether keys exist |
| `TYPE`   | Return key data type     |
| `DBSIZE` | Return number of keys    |
| `KEYS`   | Return matching keys     |

### Lists

| Command  | Description                      |
| -------- | -------------------------------- |
| `LPUSH`  | Insert elements at the beginning |
| `RPUSH`  | Insert elements at the end       |
| `LPOP`   | Remove first element             |
| `RPOP`   | Remove last element              |
| `LLEN`   | Return list length               |
| `LRANGE` | Return list range                |

### Sets

| Command     | Description            |
| ----------- | ---------------------- |
| `SADD`      | Add unique members     |
| `SREM`      | Remove members         |
| `SMEMBERS`  | Return all members     |
| `SISMEMBER` | Check membership       |
| `SCARD`     | Return set cardinality |

### Hashes

| Command   | Description                    |
| --------- | ------------------------------ |
| `HSET`    | Create or update hash fields   |
| `HGET`    | Retrieve a hash field          |
| `HGETALL` | Retrieve all fields and values |
| `HDEL`    | Delete hash fields             |
| `HLEN`    | Return number of fields        |

### Expiration

| Command   | Description                          |
| --------- | ------------------------------------ |
| `EXPIRE`  | Set expiration in seconds            |
| `PEXPIRE` | Set expiration in milliseconds       |
| `TTL`     | Return remaining TTL in seconds      |
| `PTTL`    | Return remaining TTL in milliseconds |
| `PERSIST` | Remove expiration                    |

## Running the Project

### Requirements

* Node.js 18 or later

### Install

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd mini-redis
```

No external dependencies are required.

### Start the server

```bash
npm start
```

The server will start on:

```text
127.0.0.1:8000
```

## Manual Integration Testing

Start the server:

```bash
npm start
```

In another terminal:

```bash
node test-client.js
```

The test client creates a TCP connection and sends RESP-encoded commands directly to the Mini Redis server.

Example:

```text
Connected to Mini Redis

Sending:
SET name Apoorv

Response:
+OK

Sending:
GET name

Response:
$6
Apoorv
```

## Automated Testing

Run:

```bash
npm test
```

The automated tests cover:

* RESP parsing
* String commands
* List commands
* Set commands
* Hash commands
* TTL and expiration
* NULL responses
* Invalid values
* Data structure behavior

## TTL Example

Set a key with a five-second expiration:

```text
SET session abc EX 5
```

Check the remaining TTL:

```text
TTL session
```

Possible response:

```text
:4
```

Before expiration:

```text
GET session
```

returns:

```text
abc
```

After expiration:

```text
GET session
```

returns a NULL bulk string:

```text
$-1
```

## Example Data Structure Usage

### List

```text
LPUSH tasks task1
RPUSH tasks task2 task3
LRANGE tasks 0 -1
```

### Set

```text
SADD skills Python Redis Node
SMEMBERS skills
SISMEMBER skills Redis
```

### Hash

```text
HSET user name Apoorv age 24 role engineer
HGET user name
HGETALL user
```

## Testing Philosophy

The project uses two testing approaches.

### Automated Tests

Located under:

```text
tests/
```

These test individual components and command behavior without requiring the TCP server to be running.

Run them with:

```bash
npm test
```

### Integration Client

`test-client.js` communicates with the actual TCP server.

This verifies the complete path:

```text
TCP Connection
      ↓
RESP Parser
      ↓
Command Router
      ↓
Command Implementation
      ↓
Database
      ↓
RESP Response
      ↓
TCP Client
```

## Current Limitations

This project is intentionally designed as a learning-oriented Redis implementation rather than a production replacement for Redis.

Current limitations include:

* Single-process in-memory storage
* No persistence to disk
* No replication
* No clustering
* No authentication
* Limited Redis command compatibility
* Basic pattern matching for `KEYS`
* No production-grade memory management
* No advanced RESP3 features
* No optimized eviction policy

## Learning Goals

This project was built to understand the internal building blocks behind an in-memory database and Redis-like server:

* TCP networking
* Application-layer protocols
* RESP parsing
* Command dispatch
* In-memory data structures
* Key expiration
* Storage abstraction
* Error handling
* Automated testing
* Backend systems design

## Future Improvements

Possible extensions include:

* More complete RESP support
* Additional Redis commands
* Blocking list operations
* Sorted sets
* Pub/Sub
* Transactions
* Persistence
* Snapshotting
* AOF-style logging
* Connection authentication
* Concurrent client benchmarking
* Memory usage analysis
* Latency benchmarking
* Throughput testing
* Eviction policies

