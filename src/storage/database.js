class Database {
    constructor() {
        this.store = new Map();
    }

    set(key, value, expiresAt = null) {
        this.store.set(key, {
            type: "string",
            value,
            expiresAt
        });
    }

    setEntry(key, type, value, expiresAt = null) {
        this.store.set(key, {
            type,
            value,
            expiresAt
        });
    }

    getEntry(key) {
        const entry = this.store.get(key);

        if (!entry) {
            return undefined;
        }

        if (
            entry.expiresAt !== null &&
            Date.now() >= entry.expiresAt
        ) {
            this.store.delete(key);
            return undefined;
        }

        return entry;
    }

    get(key) {
        const entry = this.getEntry(key);

        if (!entry) {
            return undefined;
        }

        return entry.value;
    }

    has(key) {
        return this.getEntry(key) !== undefined;
    }

    delete(key) {
        return this.store.delete(key);
    }

    keys() {
        this.cleanupExpired();

        return [
            ...this.store.keys()
        ];
    }

    size() {
        this.cleanupExpired();

        return this.store.size;
    }

    clear() {
        this.store.clear();
    }

    expire(key, milliseconds) {
        const entry = this.getEntry(key);

        if (!entry) {
            return false;
        }

        entry.expiresAt =
            Date.now() + milliseconds;

        return true;
    }

    persist(key) {
        const entry = this.getEntry(key);

        if (!entry) {
            return false;
        }

        if (entry.expiresAt === null) {
            return false;
        }

        entry.expiresAt = null;

        return true;
    }

    ttl(key) {
        const entry = this.getEntry(key);

        if (!entry) {
            return -2;
        }

        if (entry.expiresAt === null) {
            return -1;
        }

        const remaining =
            entry.expiresAt - Date.now();

        if (remaining <= 0) {
            this.store.delete(key);
            return -2;
        }

        return Math.floor(
            remaining / 1000
        );
    }

    pttl(key) {
        const entry = this.getEntry(key);

        if (!entry) {
            return -2;
        }

        if (entry.expiresAt === null) {
            return -1;
        }

        const remaining =
            entry.expiresAt - Date.now();

        if (remaining <= 0) {
            this.store.delete(key);
            return -2;
        }

        return remaining;
    }

    cleanupExpired() {
        for (
            const [key, entry]
            of this.store
        ) {
            if (
                entry.expiresAt !== null &&
                Date.now() >= entry.expiresAt
            ) {
                this.store.delete(key);
            }
        }
    }
}

module.exports = Database;