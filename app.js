const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const session = require('express-session');
const dotenv = require('dotenv');
const twilio = require('twilio');
const fs = require('fs');
dotenv.config();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const port = 5500;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
let user_adress = "";
app.use(session({ secret: 'sua_chave_secreta', resave: false, saveUninitialized: true }));

//Autenticação de 2 fatores via email
function gerarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/enviar-codigo', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('Email não fornecido');
    }

    const codigo = gerarCodigo();
    req.session.codigo = codigo;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ifood.ironsoft@gmail.com",
            pass: "otfagufsysgctquu",
        },
    });

    const mailOptions = {
        from: 'ifood.ironsoft@gmail.com',
        to: email,
        subject: 'Código de Verificação',
        text: `Seu código de verificação: ${codigo}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro ao enviar o código de verificação via e-mail.');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.status(200).send('Código de verificação enviado com sucesso.');
        }
    });
});

app.post('/confirmar-pagamento', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('Email não fornecido');
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ifood.ironsoft@gmail.com",
            pass: "otfagufsysgctquu",
        },
    });

    const mailOptions = {
        from: 'ifood.ironsoft@gmail.com',
        to: email,
        subject: 'Pagamento Confirmado',
        text: `O seu pagamento foi confirmado`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro ao enviar confirmação via e-mail.');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.status(200).send('Confirmação enviada com sucesso.');
        }
    });
});

app.post('/mensagem-pedido', (req, res) => {
    const { email,mensagem,assunto } = req.body;
    if (!email) {
        return res.status(400).send('Email não fornecido');
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ifood.ironsoft@gmail.com",
            pass: "otfagufsysgctquu",
        },
    });

    const mailOptions = {
        from: 'ifood.ironsoft@gmail.com',
        to: email,
        subject: assunto,
        text: mensagem
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro ao enviar confirmação via e-mail.');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.status(200).send('Confirmação enviada com sucesso.');
        }
    });
});

app.post('/verificar-codigo', (req, res) => {
    const { code } = req.body;
    const generatedCode = req.session.codigo;
    if (code === generatedCode) {
        res.status(200).send('Autenticação bem-sucedida.');
    } else {
        console.error('Código de verificação inválido.');
        res.status(401).send('Código de verificação inválido.');
    }
});




app.post('/send-sms', (req, res) => {
    console.log("rota acessada")
    const {recipient} = req.body;
    const codigo = gerarCodigo();
    req.session.codigo = codigo;

    const message = `Seu código ${codigo}`;
    
    client.messages.create({
        body: message,
        from: process.env.TWILIO_FROM_NUMBER,
        to: recipient
    })
    .then(() => {
        res.status(200).json({ message: 'Mensagem SMS enviada com sucesso!' });
    })
    .catch(error => {
        console.error('Erro ao enviar SMS:', error);
        res.status(500).json({ message: 'Erro ao enviar mensagem SMS.' });
    });
});

app.get('/', (req, res) => {   
    res.sendFile(path.join(__dirname, 'views', '/index.html'));
});
app.get('/painel', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '/painelCRUD.html'));
});

const db = new sqlite3.Database('models/database.db');
app.get('/listarDados', (req, res) => {
    db.all('SELECT * FROM produto', (err, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            res.status(500).json({ error: 'Erro ao obter os dados do banco de dados.' });
        } else {
            res.json(rows);
        }
    });
});

app.get('/produto/:nomeEstabelecimento', (req, res) => {
    const nomeEstabelecimento = req.params.nomeEstabelecimento;
    res.sendFile(path.join(__dirname, 'views', '/Produto-/produto.html'));
});

app.get('/entrar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '/entrar.html'));
});

app.get('/email', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '/email.html'));
});

app.get('/celular', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '/celular/celular.html'));
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

//CRUD ESTABELECIMENTO
app.get('/Estabelecimento/painel', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Estabelecimento/painel.html'));
});
app.get('/criarEstabelecimento', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Estabelecimento/criarEstabelecimento.html'));
});
app.post('/criarEstabelecimentodb', (req, res) => {
    const { nome, especialidade,endereco } = req.body;
    db.get('SELECT id_estabelecimento FROM estabelecimento WHERE nome = ?', [nome], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Estabelecimento já cadastrado com esse nome' });
        }
    
        db.run('INSERT INTO estabelecimento (nome, especialidade,endereco) VALUES (?, ?, ?)', [nome, especialidade,endereco], function(err) {
            if (err) {
                console.log("Erro bizarro, nem foi")
                return res.status(500).json({ error: err.message });
            }
            db.get('SELECT * from estabelecimento WHERE id_estabelecimento = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                    console.log("Erro ao adicionar o estabelecimento")
                }
                console.log("Estabelecimento adicionado com sucesso")
                res.json({ message: 'Estabelecimento adicionado com sucesso', cliente: row });
            });
        });
    });
});

app.get('/consultarEstabelecimento', (req, res) => {
    db.all('SELECT * FROM estabelecimento', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ estabelecimentos: rows });
    });
});
app.get('/consultarIDEstabelecimento/:id_estabelecimento', (req, res) => {
    const { id_estabelecimento } = req.params;
    db.all('SELECT * FROM estabelecimento where id_estabelecimento = ?',[id_estabelecimento], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ estabelecimentos: rows });
    });
});
app.get('/alterarEstabelecimento', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Estabelecimento/alterarEstabelecimento.html'));
});

app.post('/alterarEstabelecimentodb', (req, res) => {
    const { nome, especialidade,endereco,id_estabelecimento } = req.body;
    db.run('UPDATE estabelecimento SET nome = ?, especialidade = ?, endereco = ? WHERE id_estabelecimento = ?', [nome, especialidade, endereco, id_estabelecimento], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.get('SELECT * FROM estabelecimento WHERE id_estabelecimento = ?', [id_estabelecimento], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: 'estabelecimento atualizado com sucesso', estabelecimento: row });            
        });
    });
});

app.get('/deletarEstabelecimento', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Estabelecimento/deletarEstabelecimento.html'));
});
app.post('/deletarEstabelecimentodb', (req, res) => {
    const {id_estabelecimento } = req.body;
    db.run('DELETE FROM estabelecimento WHERE id_estabelecimento = ?', [id_estabelecimento], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM estabelecimento WHERE id_estabelecimento = ?', [id_estabelecimento], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
                console.log("Erro na consulta");
            }

            res.json({ message: 'estabelecimento deletado', cliente: row });            
        });
    });
});

//CRUD PRODUTO
app.get('/produto-/painel', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Produto-/painel.html'));
});
app.get('/criarProduto', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Produto-/criarProduto.html'));
});
app.post('/criarProdutodb', (req, res) => {
    const { nome, descricao,preco,id_estabelecimento } = req.body;
    db.get('SELECT nome FROM produto WHERE nome = ?', [nome], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Produto já cadastrado com esse nome' });
        }
    
        db.run('INSERT INTO produto (nome, descricao,preco,id_estabelecimento) VALUES (?, ?, ?,?)', [nome, descricao,preco,id_estabelecimento], function(err) {
            if (err) {
                console.log("Erro bizarro, nem foi")
                return res.status(500).json({ error: err.message });
            }
            db.get('SELECT * from produto WHERE id_produto = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                    console.log("Erro ao adicionar o produto")
                }
                console.log("Produto adicionado com sucesso")
                res.json({ message: 'Produto adicionado com sucesso', cliente: row });
            });
        });
    });
});

app.get('/consultarProduto', (req, res) => {
    const { id_estabelecimento } = req.query;
    db.all('SELECT * FROM produto WHERE id_estabelecimento = ?', [id_estabelecimento], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ produtos: rows });
    });
});

app.get('/listarProduto', (req, res) => {
    db.all('SELECT * FROM produto', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ produtos: rows });
    });
});
app.get('/alterarProduto', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Produto/alterarProduto.html'));
});

app.post('/alterarProdutodb', (req, res) => {
    const { nome, descricao,preco,id_produto } = req.body;
    db.run('UPDATE produto SET nome = ?, descricao = ?, preco = ? WHERE id_produto = ?', [nome, descricao, preco, id_produto], function(err) {
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

app.get('/deletarProduto', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Produto/deletarProduto.html'));
});
app.post('/deletarProdutodb', (req, res) => {
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

//CRUD ENTREGADOR
app.get('/entregador/painel', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Entregador/painel.html'));
});
app.get('/criarEntregador', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Entregador/criarEntregador.html'));
});
app.post('/criarEntregadordb', (req, res) => {
    const { nome,email,telefone  } = req.body;
    db.get('SELECT nome FROM entregador WHERE nome = ?', [nome], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Entregador já cadastrado com esse nome' });
        }
        db.run('INSERT INTO entregador (nome,email,telefone ) VALUES (?, ?, ?)', [nome,email,telefone ], function(err) {
            if (err) {
                console.log("Erro bizarro, nem foi")
                return res.status(500).json({ error: err.message });
            }
            db.get('SELECT * from entregador WHERE id_entregador = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                    console.log("Erro ao adicionar o entregador")
                }
                console.log("Entregador adicionado com sucesso")
                res.json({ message: 'Entregador adicionado com sucesso', cliente: row });
            });
        });
    });
});

app.get('/consultarEntregador', (req, res) => {
    db.all('SELECT * FROM entregador', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ entregadors: rows });
    });
});
app.get('/alterarEntregador', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Entregador/alterarEntregador.html'));
});

app.post('/alterarEntregadordb', (req, res) => {
    const { nome,email,telefone,id_entregador } = req.body;
    db.run('UPDATE entregador SET nome = ?, email = ?, telefone = ? WHERE id_entregador = ?', [nome,email,telefone,id_entregador], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM entregador WHERE id_entregador = ?', [id_entregador], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: 'entregador atualizado com sucesso', entregador: row });            
        });
    });
});

app.get('/deletarEntregador', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Entregador/deletarEntregador.html'));
});
app.post('/deletarEntregadordb', (req, res) => {
    const {id_entregador } = req.body;
    db.run('DELETE FROM entregador WHERE id_entregador = ?', [id_entregador], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM entregador WHERE id_entregador = ?', [id_entregador], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
                console.log("Erro na consulta");
            }

            res.json({ message: 'entregador deletado', cliente: row });            
        });
    });
});

//CRUD Endereço
app.get('/Endereco/painel', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Endereço/painel.html'));
});
app.get('/cadastrarEndereco', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Endereço/endereço.html'));
});
app.post('/cadastrarEnderecodb', (req, res) => {
    const { nome  } = req.body;
    db.get('SELECT nome FROM endereco WHERE nome = ?', [nome], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Endereço já cadastrado com esse nome' });
        }
        db.run('INSERT INTO endereco (nome ) VALUES (?)', [nome], function(err) {
            if (err) {
                console.log("Erro bizarro, nem foi")
                return res.status(500).json({ error: err.message });
            }
            db.get('SELECT * from endereco WHERE id_endereco = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                    console.log("Erro ao adicionar o endereço")
                }
                user_adress= row;
                console.log(user_adress.nome)
                console.log("Endereço adicionado com sucesso")
                res.json({ message: 'Endereço adicionado com sucesso', endereco: row });
            });
        });
    });
});

app.get('/consultarEndereco', (req, res) => {
    db.all('SELECT * FROM endereco', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ enderecos: rows });
    });
});
app.get('/alterarEndereco', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Endereço/alterarEndereço.html'));
});

app.post('/alterarEnderecodb', (req, res) => {
    const { nome,id_endereco } = req.body;
    db.run('UPDATE endereco SET nome = ? WHERE id_endereco = ?', [nome,id_endereco], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM endereco WHERE id_endereco = ?', [id_endereco], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: 'endereco atualizado com sucesso', endereco: row });            
        });
    });
});

app.get('/deletarEndereco', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Endereço/deletarEndereço.html'));
});
app.post('/deletarEnderecodb', (req, res) => {
    const {id_endereco } = req.body;
    db.run('DELETE FROM endereco WHERE id_endereco = ?', [id_endereco], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM endereco WHERE id_endereco = ?', [id_endereco], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
                console.log("Erro na consulta");
            }

            res.json({ message: 'endereco deletado', cliente: row });            
        });
    });
});


//Pagamento

app.get('/Pagamento/pagamento', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Pagamento/pagamento.html'));
});
app.get('/status-pedido', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', '/Entrega/entrega.html'));
});

//Server
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});

