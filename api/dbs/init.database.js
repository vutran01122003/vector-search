const mongoose = require('mongoose');
const { MONGODB_ATLAS_URI } = process.env;

class Database {
    connection = null;
    instance = null;

    static getInstance() {
        if (this.instance) {
            return Database.instance;
        }

        this.instance = new Database();
        return this.instance;
    }

    connect() {
        this.connection = mongoose.createConnection(MONGODB_ATLAS_URI);
        this.connection.on('connected', function () {
            console.log('Database connected:::', this.name);
        });

        this.connection.on('error', (error) => {
            console.log('Atlas connection error:', error);
        });
    }

    getConnection() {
        return this.connection;
    }

    disconnect() {
        if (this.connection.readyState === 1) {
            this.connection.close();
        }
        return null;
    }
}

module.exports = Database;
