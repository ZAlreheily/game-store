const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')

const getDbConnection = async () => {
    return await sqlite.open({
        filename: './databases/gamee.db3',
        driver: sqlite3.Database
    })
}


// get functions

async function getAllGames() {
    const db = await getDbConnection();
    const rows = await db.all('SELECT * FROM game');
    await db.close();
    return rows

}

async function getGame(game_id) {
    const db = await getDbConnection();
    const rows = await db.all('SELECT * FROM game WHERE id = ' + game_id);
    await db.close();
    return rows[0]
}



async function getCartItems(user_id) {
    const db = await getDbConnection();
    const rows = await db.all(`SELECT g.id,title,image,price,type,c.id AS cart_id FROM game AS g JOIN cartItem AS c ON g.id = c.game_id WHERE c.user_id = ${user_id}`);
    await db.close();
    return rows
}

async function isCartEmpty(user_id) {
    const db = await getDbConnection();
    const rows = await db.all(`SELECT id FROM cartItem where user_id = ${user_id}`);
    await db.close();
    if (rows.length == 0)
        return true
    return false
}

async function getOrders(user_id) {
    if (user_id == undefined)
        return
    const db = await getDbConnection();
    const rows = await db.all('SELECT * FROM orders WHERE user_id = ' + user_id);
    await db.close();
    return rows
}
async function getOrderItems(order_id) {
    const db = await getDbConnection();
    const rows = await db.all(`SELECT g.id,title,image,g.price,type FROM game as g join orderItem as o on g.id = o.game_id where o.order_id = ${order_id}`);
    await db.close();
    return rows
}

async function getUserByEmail(email) {
    const db = await getDbConnection();
    const rows = await db.all(`SELECT * FROM user WHERE email = "${email}"`);
    await db.close();
    return rows[0]
}
// adding

async function addGame(title, image, price, platform, type) {
    const db = await getDbConnection();
    largestID = await db.all('SELECT MAX(id) FROM game');
    largestID = largestID[0]["MAX(id)"];
    if (largestID == null)
        largestID = 1;
    largestID += 1
    var sql = `INSERT INTO
    game(id,title,image,price,platform,type
    ) VALUES (${largestID},"${title}","${image}",${price},"${platform}","${type}")`;
    const meta = await db.run(sql);
    await db.close();
    return meta;
}

async function addUser(password, name, email) {
    const db = await getDbConnection();
    largestID = await db.all('SELECT MAX(id) FROM user');
    largestID = largestID[0]["MAX(id)"];
    if (largestID == null)
        largestID = 1;
    largestID += 1

    var sql = `INSERT INTO
    user(id,password,name,email
    ) VALUES (${largestID},"${password}","${name}","${email}")`;
    const meta = await db.run(sql);
    await db.close();
    return meta;
}

async function addOrder(user_id) {
    const db = await getDbConnection();
    largestID = await db.all('SELECT MAX(id) FROM orders');
    largestID = largestID[0]["MAX(id)"];
    if (largestID == null)
        largestID = 45970;
    largestID += 1
    var price = 0;
    var gamesList = await getCartItems(user_id)

    gamesList.forEach(async element => {
        await addOrderItem(largestID, element.id, element.price)
        price += element.price
    });
    var sql = `INSERT INTO
    orders(id,user_id,price
    ) VALUES (${largestID},${user_id},${price})`;
    const meta = await db.run(sql);
    await deleteAllCartItems(user_id);
    await db.close();
    return meta;
}

async function addOrderItem(order_id, game_id, price) {
    const db = await getDbConnection();
    var id =  Math.floor(Math.random()*100000000);
    largestID = await db.all('SELECT id FROM orderItem where id = '+id);

    var sql = `INSERT INTO
    orderItem(id,order_id,game_id,price
    ) VALUES (${id},${order_id},${game_id},${price})`;
    const meta = await db.run(sql);
    await db.close();
    return meta;
}

async function addCartItem(user_id, game_id) {
    const db = await getDbConnection();
    largestID = await db.all('SELECT MAX(id) FROM cartItem');
    largestID = largestID[0]["MAX(id)"];
    if (largestID == null)
        largestID = 1;
    largestID += 1

    var sql = `INSERT INTO
    cartItem(id,user_id,game_id
    ) VALUES (${largestID},${user_id},${game_id})`;
    const meta = await db.run(sql);
    await db.close();
    return meta;
}

// deleting

async function deleteCartItem(cart_id) {
    const db = await getDbConnection();
    var sql = `DELETE FROM
    cartItem WHERE id = ${cart_id}`;
    const meta = await db.run(sql)
    await db.close()
    return meta
}

async function deleteAllCartItems(user_id) {
    const db = await getDbConnection();
    var sql = `DELETE FROM
    cartItem WHERE user_id = ${user_id}`;
    const meta = await db.run(sql)
    await db.close()
    return meta
}
// createTables()
module.exports = {
    getAllGames, getGame, getCartItems, getOrders, addOrder, addUser,
    addCartItem, deleteCartItem, addGame, getOrderItems, getUserByEmail, isCartEmpty
}

