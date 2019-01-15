import { isBrowser } from './platform';
export var SqlDatabase = (function () {
    function SqlDatabase(_db) {
        this._db = _db;
    }
    SqlDatabase.open = function (name, initStatements) {
        if (initStatements === void 0) { initStatements = []; }
        var dbPromise = isBrowser().then(function (browser) {
            var openDatabase = browser ? openBrowserDatabase : openCordovaDatabase;
            return openDatabase(name);
        });
        if (initStatements.length === 0) {
            return dbPromise;
        }
        var _db;
        // execute the first statement and capture the _db
        dbPromise.then(function (db) {
            _db = db;
            return db.execute(initStatements.shift());
        });
        // execute all the other statements (if any) sequentially
        var _loop_1 = function(sql) {
            dbPromise = dbPromise.then(function () { return _db.execute(sql); });
        };
        for (var _i = 0, initStatements_1 = initStatements; _i < initStatements_1.length; _i++) {
            var sql = initStatements_1[_i];
            _loop_1(sql);
        }
        // resolve the _db only after all statements have completed
        return new Promise(function (resolve, reject) {
            dbPromise.then(function () { return resolve(_db); }).catch(reject);
        });
    };
    SqlDatabase.prototype.execute = function (statement, params) {
        var _this = this;
        if (params === void 0) { params = []; }
        return new Promise(function (resolve, reject) {
            _this._db.transaction(function (tx) {
                return tx.executeSql(statement, params, function (tx, resultSet) {
                    resolve(resultSet);
                }, function (tx, error) {
                    reject(error);
                });
            });
        });
    };
    SqlDatabase.prototype.executeBulk = function (statement, params) {
        var _this = this;
        if (params === void 0) { params = []; }
        return new Promise(function (resolve, reject) {
            _this._db.transaction(function (tx) {
                for (var i = 0; i < params.length; i++) {
                    tx.executeSql(statement, params[i], function (tx, resultSet) {
                        resolve(resultSet);
                    }, function (tx, error) {
                        reject(error);
                    });
                }
            });
        });
    };
    return SqlDatabase;
}());
function openCordovaDatabase(name) {
    return new Promise(function (resolve, reject) {
        if (typeof sqlitePlugin === 'undefined') {
            reject(new Error('[ionix-sqlite] sqlitePlugin global object not found; did you install a Cordova SQLite plugin?'));
        }
        var db = sqlitePlugin.openDatabase({
            name: name,
            location: 'default'
        });
        console.info('[ionix-sqlite] using Cordova sqlitePlugin');
        resolve(new SqlDatabase(db));
    });
}
function openBrowserDatabase(name) {
    return new Promise(function (resolve, reject) {
        try {
            var db = openDatabase(name, '1.0', name, -1);
            console.info('[ionix-sqlite] using WebSQL');
            resolve(new SqlDatabase(db));
        }
        catch (error) {
            reject(error);
        }
    });
}
