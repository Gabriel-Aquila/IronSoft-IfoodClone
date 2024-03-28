app.post('/cliente', (req, res) => {
    const { nome, email } = req.body;

    db.run('INSERT INTO cliente (nome, email) VALUES (?, ?)', [nome, telefone], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Cliente adicionado com sucesso', id: this.lastID });
    });
});