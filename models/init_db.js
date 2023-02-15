const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')

const getDbConnection = async () => {
    return await sqlite.open({
        filename: './databases/gamee.db3',
        driver: sqlite3.Database
    })
}

async function createTables() {
    const db = await getDbConnection();

    sql = `CREATE TABLE IF NOT EXISTS game(id INTEGER 
        PRIMARY KEY, title, image, price INTEGER, platform, type)`;
    await db.run(sql);

    sql = `CREATE TABLE IF NOT EXISTS user(id INTEGER 
        PRIMARY KEY,password NOT NULL, name NOT NULL, email  NOT NULL UNIQUE)`;
    await db.run(sql);

    sql = `CREATE TABLE IF NOT EXISTS orders(id INTEGER 
        PRIMARY KEY, user_id INTEGER NOT NULL, price INTEGER)`;
    await db.run(sql);

    sql = `CREATE TABLE IF NOT EXISTS orderItem(id INTEGER 
        PRIMARY KEY, order_id INTEGER NOT NULL,game_id INTEGER NOT NULL, price INTEGER)`;
    await db.run(sql);

    sql = `CREATE TABLE IF NOT EXISTS cartItem(id INTEGER 
        PRIMARY KEY, user_id INTEGER NOT NULL,game_id INTEGER NOT NULL)`;
    await db.run(sql);
}

createTables()