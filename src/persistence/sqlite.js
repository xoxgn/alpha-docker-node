const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/tmp/todo.db';

let db, dbAll, dbRun;

/**
 * @type {import('.').PersistenceModule}
 */
const definition = {
    init: function init() {
        const dirName = require('path').dirname(location);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }
    
        return new Promise((acc, rej) => {
            db = new sqlite3.Database(location, err => {
                if (err) return rej(err);
    
                if (process.env.NODE_ENV !== 'test')
                    console.log(`Using sqlite database at ${location}`);
    
                db.run(
                    'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
                    (err, result) => {
                        if (err) return rej(err);
                        acc();
                    },
                );
            });
        });
    },
    teardown: function teardown() {
        return new Promise((acc, rej) => {
            db.close(err => {
                if (err) rej(err);
                else acc();
            });
        });
    },    
    getItems: function getItems() {
        return new Promise((acc, rej) => {
            db.all('SELECT * FROM todo_items', (err, rows) => {
                if (err) return rej(err);
                acc(
                    rows.map(item =>
                        Object.assign({}, item, {
                            completed: item.completed === 1,
                        }),
                    ),
                );
            });
        });
    },
    getItem: function getItem(id) {
        return new Promise((acc, rej) => {
            db.all('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
                if (err) return rej(err);
                acc(
                    rows.map(item =>
                        Object.assign({}, item, {
                            completed: item.completed === 1,
                        }),
                    )[0],
                );
            });
        });
    },
    removeItem: function removeItem(id) {
        return new Promise((acc, rej) => {
            db.run('DELETE FROM todo_items WHERE id = ?', [id], err => {
                if (err) return rej(err);
                acc();
            });
        });
    },
    storeItem: function storeItem(item) {
        return new Promise((acc, rej) => {
            db.run(
                'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
                [item.id, item.name, item.completed ? 1 : 0],
                err => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    },
    updateItem: function updateItem(id, item) {
        return new Promise((acc, rej) => {
            db.run(
                'UPDATE todo_items SET name=?, completed=? WHERE id = ?',
                [item.name, item.completed ? 1 : 0, id],
                err => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    }
    
}

/**
 * Persistence module; SQLite version.
 * @module persistence
 */
module.exports = definition