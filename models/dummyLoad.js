const db = require("./model.js");

async function loadDummies() {
    // await db.addGame("Elden Ring", "eldenring.png", 39.99, "PS5", "DIGITAL")
    await db.addGame("Sekiro: Shadows Die Twice - GOTY Edition", "sekiro.png", 29.99, "PS4","PHYSICAL")
    await db.addGame("God of War Ragnarök", "gow.png", 59.99, "PS5", "DIGITAL")
    await db.addGame("Persona 5 Royal", "persona.png", 59.99, "PS4","PHYSICAL")
    await db.addGame("Final Fantasy XIV: Endwalker", "ffxiv.png", 49.99, "PS4", "DIGITAL")
    await db.addGame("Ghost of Tsushima: Director's Cut", "ghostoftsushima.png", 49.99, "PS5", "DIGITAL")
    await db.addGame("The Witcher 3: Wild Hunt - Complete Edition", "wither.png", 19.99, "PS4", "DIGITAL")
    await db.addGame("NieR: Automata", "nier.png", 24.99, "PS4","PHYSICAL")
    await db.addGame("The Legend of Zelda: Breath of the Wild", "zelda.png", 59.99, "SWITCH","PHYSICAL")
    await db.addGame("Xenoblade Chronicles 3", "xenoblade.png", 59.99, "SWITCH","PHYSICAL")
}

loadDummies()
