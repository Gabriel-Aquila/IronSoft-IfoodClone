const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('models/database.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cliente (id_cliente INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT,email TEXT, telefone TEXT)');
});

app.get('/', (req, res) => {
    db.all('SELECT * FROM cliente', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/criarCliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'models', '/form.html'));
});

app.post('/cliente', (req, res) => {
    const { nome, email,telefone } = req.body;

    db.run('INSERT INTO cliente (nome, email,telefone) VALUES (?, ?, ?)', [nome, email, telefone], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT id_cliente, nome, email, telefone FROM cliente WHERE id_cliente = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: 'Cliente adicionado com sucesso', cliente: row });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
