const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5500;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const db = new sqlite3.Database('models/database.db');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '/index.html'));
});

app.get('/entrar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '/entrar.html'));
});

app.get('/email', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '/email.html'));
});
app.post('/logar-email', (req, res) => {
    const {email} = req.body;
    fetch('http://localhost:5500/criarClientedb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: 'Anonymous',
          email: email,
          telefone:'0000000000'
        })
      })
      .then(response => response.json())
      .then( email=> {
        console.log('Resposta do servidor:');
      })
      .catch(error => {
        console.error('Erro ao fazer requisição:', error);
      });
      console.log("Função executada")
    res.sendFile(path.join(__dirname, 'views', '/index.html'));
});

app.post('/criarClientedb', (req, res) => {
    const { nome, email,telefone } = req.body;
    db.get('SELECT id_cliente FROM cliente WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Cliente já cadastrado com esse email' });
        }
    
        db.run('INSERT INTO cliente (nome, email,telefone) VALUES (?, ?, ?)', [nome, email, telefone], function(err) {
            if (err) {
                console.log("Erro bizarro, nem foi")
                return res.status(500).json({ error: err.message });
            }
            db.get('SELECT id_cliente, nome, email, telefone FROM cliente WHERE id_cliente = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                    console.log("Erro ao adicionar o cliente")
                }
                console.log("Cliente adicionado com sucesso")
                res.json({ message: 'Cliente adicionado com sucesso', cliente: row });
            });
        });
    });
});

app.post('/alterarClientedb', (req, res) => {
    const { nome, email,telefone,id_cliente } = req.body;
    db.run('UPDATE cliente SET nome = ?, email = ?, telefone = ? WHERE id_cliente = ?', [nome, email, telefone, id_cliente], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.get('SELECT id_cliente, nome, email, telefone FROM cliente WHERE id_cliente = ?', [id_cliente], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: 'Cliente atualizado com sucesso', cliente: row });            
        });
    });
});

//CRUD produto
app.get('/painel', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/produto/painel.html'));
});
app.get('/criarproduto', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/produto/criarproduto.html'));
});
app.post('/criarprodutodb', (req, res) => {
    const { nome, preco,descricao } = req.body;
    db.get('SELECT id_produto FROM produto WHERE nome = ?', [nome], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'produto já cadastrado com esse nome' });
        }
    
        db.run('INSERT INTO produto (nome, preco,descricao) VALUES (?, ?, ?)', [nome, preco,descricao], function(err) {
            if (err) {
                console.log("Erro bizarro, nem foi")
                return res.status(500).json({ error: err.message });
            }
            db.get('SELECT * from produto WHERE id_produto = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                    console.log("Erro ao adicionar o produto")
                }
                console.log("produto adicionado com sucesso")
                res.json({ message: 'produto adicionado com sucesso', cliente: row });
            });
        });
    });
});

app.get('/consultarproduto', (req, res) => {
    db.all('SELECT * FROM produto', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ produtos: rows });
    });
});
app.get('/alterarproduto', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/produto/alterarproduto.html'));
});

app.post('/alterarprodutodb', (req, res) => {
    const { nome, preco,descricao,id_produto } = req.body;
    db.run('UPDATE produto SET nome = ?, preco = ?, descricao = ? WHERE id_produto = ?', [nome, preco, descricao, id_produto], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.get('SELECT * FROM produto WHERE id_produto = ?', [id_produto], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: 'produto atualizado com sucesso', produto: row });            
        });
    });
});

app.get('/deletarproduto', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/produto/deletarproduto.html'));
});
app.post('/deletarprodutodb', (req, res) => {
    const {id_produto } = req.body;
    db.run('DELETE FROM produto WHERE id_produto = ?', [id_produto], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM produto WHERE id_produto = ?', [id_produto], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
                console.log("Erro na consulta");
            }

            res.json({ message: 'produto deletado', cliente: row });            
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
