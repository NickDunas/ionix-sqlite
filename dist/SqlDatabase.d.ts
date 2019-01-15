import { SqlResultSet } from './SqlResultSet';
export declare class SqlDatabase {
    private _db;
    constructor(_db: any);
    static open(name: string, initStatements?: string[]): Promise<SqlDatabase>;
    execute(statement: string, params?: any[]): Promise<SqlResultSet>;
    executeBulk(statement: string, params?: any[]): Promise<SqlResultSet>;
}
