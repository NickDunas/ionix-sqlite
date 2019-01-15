(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ionixSqlite", [], factory);
	else if(typeof exports === 'object')
		exports["ionixSqlite"] = factory();
	else
		root["ionixSqlite"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var platform_1 = __webpack_require__(1);
var SqlDatabase = (function () {
    function SqlDatabase(_db) {
        this._db = _db;
    }
    SqlDatabase.open = function (name, initStatements) {
        if (initStatements === void 0) { initStatements = []; }
        var dbPromise = platform_1.isBrowser().then(function (browser) {
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
exports.SqlDatabase = SqlDatabase;
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


/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
"use strict";
function isBrowser() {
    if (typeof cordova === 'undefined') {
        return Promise.resolve(true);
    }
    return new Promise(function (resolve) {
        document.addEventListener('deviceready', function () {
            resolve(cordova.platformId === 'browser');
        });
    });
}
exports.isBrowser = isBrowser;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var SqlDatabase_1 = __webpack_require__(0);
exports.SqlDatabase = SqlDatabase_1.SqlDatabase;


/***/ }
/******/ ])
});
;