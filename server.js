const express = require("express");
const nunjucks = require("nunjucks")
const path = require("path");
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const session = require('express-session')
const db = require("./models/model.js");
const utilitles = require("./utilities/utilities.js")

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'somevalue'
}));


app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
nunjucks.configure('views', { express: app })

const isLoggedIn = (req, res, next) => {
    if (!req.session?.email) {
        return res.redirect(`/login`)
    }
    next()
}

app.get("/", (req, res) => {
    res.render('Home.html');
});

app.get("/login", (req, res) => {
    res.render('Sign-in.html');

});
app.post("/login", async (req, res) => {
    try {
        const matchUser = await db.getUserByEmail(req.body.email)
        const matchPassword = await bcrypt.compare(req.body.password, matchUser.password)
        if (!matchUser || !matchPassword)
            throw 'Invalid Credentials'

        req.session.regenerate(() => {
            req.session.email = matchUser.email
            req.session.user_id = matchUser.id;
            res.redirect('/')
        })
    } catch (e) {
        console.log(e)
        res.render('Sign-in.html', {
            incorrect: true,
            errors: 'Invalid Credentials'
        })
    }
});
app.get("/signup", (req, res) => {
    res.render('Sign-up.html');
});

app.post("/signup", async (req, res) => {
    const matchUser = await db.getUserByEmail(req.body.email)
    if (matchUser) {
        return res.render('Sign-up.html', {
            email: req.body.email,
            incorrect: true,
            error: 'Username is taken'
        })
    }
    const newUser = req.body
    newUser.password = await bcrypt.hash(req.body.password, 13)
    await db.addUser(newUser.password, null, newUser.email)
    res.redirect('/login')
});

app.get("/browse", async (req, res) => {
    const games = await db.getAllGames();
    res.render('Browse-games.html', { games });
});

app.get("/games/:game_id", async (req, res) => {
    const game = await db.getGame(req.params["game_id"]);
    res.render('Game-1.html', { game });
});

app.get("/cart", isLoggedIn, async (req, res) => {
    const items = await db.getCartItems(req.session.user_id);
    total = utilitles.calculateTotalPrice(items)
    res.render('Cart.html', { items, total });
});

app.get("/cart/:game_id", isLoggedIn, async (req, res) => {
    db.addCartItem(req.session.user_id, req.params["game_id"]);
    res.redirect("/cart")
});

app.get("/cart/remove/:cart_id", async (req, res) => {
    await db.deleteCartItem(req.params["cart_id"]);
    res.redirect("/cart")
});

app.get("/order", isLoggedIn, async (req, res) => {
    const isEmpty = await db.isCartEmpty(req.session.user_id)
    if (isEmpty) {
        res.redirect("/cart")
    } else {
        const order = await db.addOrder(req.session.user_id);
        res.render('orderConfirmation.html', { id: order.lastID });
    }
});

app.get("/orders/:id",isLoggedIn, async (req, res) => {
    const items = await db.getOrderItems(req.params["id"]);
    total = utilitles.calculateTotalPrice(items)
    res.render('order.html', { items, total });
}
);

app.get("/orders",isLoggedIn, async (req, res) => {
    const orders = await db.getOrders(req.session.user_id);
    res.render('ordersPage.html',{orders});
});

// API

app.get("/api/games", async (req, res) => {
    const game = await db.getAllGames();
    res.json(game)
});

app.get("/api/games/:game_id", async (req, res) => {
    const game = await db.getGame(req.params["game_id"]);
    res.json(game)
});


app.listen(PORT, (err) => {
    console.log("Server is running on port " + PORT)
});