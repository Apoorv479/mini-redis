class Database {
    constructor() {
        this.store = new Map();
    }

    set(key, value) {
        this.store.set(key, value);
    }

    get(key) {
        return this.store.get(key);
    }

    has(key) {
        return this.store.has(key);
    }

    delete(key) {
        return this.store.delete(key);
    }

    keys() {
        return [...this.store.keys()];
    }

    size() {
        return this.store.size;
    }

    clear() {
        this.store.clear();
    }
}

module.exports = Database;