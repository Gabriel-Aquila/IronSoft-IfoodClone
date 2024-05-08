const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../models/database.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cliente (id_cliente INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,email TEXT, telefone TEXT, endereco TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS estabelecimento (id_estabelecimento INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,especialidade TEXT, endereco TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS pagamento (id_produto INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,descricao TEXT, preco TEXT)');
});


db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS entregador (id_entregador INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,email TEXT, telefone TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS pedido (id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,id_cliente INTEGER,id_estabelecimento INTEGER,id_entregador INTEGER,  Status TEXT,Data_Hora_Pedido blob, Data_Hora_Entregador blob)');
});


db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS produto (id_produto INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,id_estabelecimento INTEGER NOT NULL,descricao TEXT, preco TEXT,FOREIGN KEY(id_estabelecimento) REFERENCES estabelecimento(id_estabelecimento))');
});
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS endereco (id_endereco INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)');
});
db.serialize(() => {
});
db.close();