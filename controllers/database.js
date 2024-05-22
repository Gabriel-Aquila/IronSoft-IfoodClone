const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../models/database.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cliente (id_cliente INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, telefone TEXT, endereco TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS estabelecimento (id_estabelecimento INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, especialidade TEXT, endereco TEXT)');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS produto (id_produto INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, id_estabelecimento INTEGER NOT NULL, descricao TEXT, preco REAL, FOREIGN KEY(id_estabelecimento) REFERENCES estabelecimento(id_estabelecimento))');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS pedido (id_pedido INTEGER PRIMARY KEY AUTOINCREMENT, id_cliente INTEGER, id_estabelecimento INTEGER, id_entregador INTEGER, status TEXT, data_hora_pedido TEXT, data_hora_entregador TEXT, FOREIGN KEY(id_cliente) REFERENCES cliente(id_cliente), FOREIGN KEY(id_estabelecimento) REFERENCES estabelecimento(id_estabelecimento), FOREIGN KEY(id_entregador) REFERENCES entregador(id_entregador))');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS pedido_produto (id_pedido_produto INTEGER PRIMARY KEY AUTOINCREMENT, id_pedido INTEGER, id_produto INTEGER, quantidade INTEGER, FOREIGN KEY(id_pedido) REFERENCES pedido(id_pedido), FOREIGN KEY(id_produto) REFERENCES produto(id_produto))');
});

db.close();
