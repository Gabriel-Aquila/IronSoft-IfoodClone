const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../models/database.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cliente (id_cliente INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,email TEXT, telefone TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS estabelecimento (id_estabelecimento INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,especialidade TEXT, endereco TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS produto (id_produto INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,descricao TEXT, preco TEXT)');
});

/*
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cliente (id_cliente INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,email TEXT, telefone TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cliente (id_cliente INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,email TEXT, telefone TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cliente (id_cliente INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,email TEXT, telefone TEXT)');
});
*/

db.serialize(() => {
    db.run('SELECT id_cliente, nome, email, telefone FROM cliente');
});

db.serialize(() => {
    db.run('SELECT* FROM estabelecimento');
});

db.close();