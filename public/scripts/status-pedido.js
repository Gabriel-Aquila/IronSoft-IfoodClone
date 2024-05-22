const divRestaurante = document.getElementById('restaurante');
const divStatus = document.getElementById('status-pedido');
const divPedido = document.getElementById('pedido');
let assunto = '';
let mensagem = '';
let user = JSON.parse(localStorage.getItem('User')) || [];
let email = user[0].contato;

window.onload = function () {
    let statusP = document.createElement('p');
    statusP.innerHTML = `Seu pedido está a caminho`;
    divRestaurante.appendChild(statusP);

    const messages = [
        { mensagem: 'Pedido sendo preparado', assunto: 'Status pedido' },
        { mensagem: 'Pedido saiu para entrega', assunto: 'Status pedido' },
        { mensagem: 'Pedido chegou', assunto: 'Status pedido' }
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            console.log(`Email: ${email}, Assunto: ${msg.assunto}, Mensagem: ${msg.mensagem}`);
            fetch('/mensagem-pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `email=${encodeURIComponent(email)}&assunto=${encodeURIComponent(msg.assunto)}&mensagem=${encodeURIComponent(msg.mensagem)}`
            })
            .then(response => {
                if (response.ok) {
                    console.log("fetch ok");
                } else {
                    throw new Error('Erro ao enviar confirmação.');
                }
            })
            .catch(error => {
                console.error(error);
            });
        }, index * 30000); // Delay each request by 10 seconds
    });
    displayNotaFiscal();

};

function displayNotaFiscal() {
    const notaFiscal = `
        <div style="border: 1px solid #000; padding: 20px; max-width: 600px; margin: auto;">
            <h2 style="text-align: center;">Nota Fiscal</h2>
            <div style="margin-bottom: 20px;">
                <strong>Emitente:</strong>
                <p>Nome da Empresa</p>
                <p>CNPJ: 00.000.000/0001-00</p>
                <p>Endereço: Rua Exemplo, 123 - Cidade - Estado</p>
                <p>CEP: 12345-678</p>
                <p>Telefone: (00) 0000-0000</p>
            </div>
            <div style="margin-bottom: 20px;">
                <strong>Destinatário:</strong>
                <p>Nome do Cliente</p>
                <p>CPF: 000.000.000-00</p>
                <p>Endereço: Rua Cliente, 456 - Cidade - Estado</p>
                <p>CEP: 87654-321</p>
                <p>Telefone: (00) 98765-4321</p>
            </div>
            <table border="1" width="100%" style="border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Valor Unitário</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Produto A</td>
                        <td>2</td>
                        <td>R$ 50,00</td>
                        <td>R$ 100,00</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Produto B</td>
                        <td>1</td>
                        <td>R$ 100,00</td>
                        <td>R$ 100,00</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right;">Subtotal</td>
                        <td>R$ 200,00</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: right;">Frete</td>
                        <td>R$ 20,00</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="text-align: right;">Total</td>
                        <td>R$ 220,00</td>
                    </tr>
                </tfoot>
            </table>
            <div style="margin-top: 20px;">
                <p><strong>Data da Emissão:</strong> 21/05/2024</p>
                <p><strong>Data de Vencimento:</strong> 28/05/2024</p>
            </div>
        </div>
    `;
    assunto ="Nota fiscal";
    mensagem="Aqui esta a nota fiscal do seu pedido";   
    document.getElementById('nota-fiscal').innerHTML = notaFiscal;

    fetch('/nota-fiscal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${encodeURIComponent(email)}&assunto=${encodeURIComponent(assunto)}&mensagem=${encodeURIComponent(mensagem)}`
    })
    .then(response => {
        if (response.ok) {
            console.log("fetch ok");
        } else {
            throw new Error('Erro ao enviar confirmação.');
        }
    })
    .catch(error => {
        console.error(error);
    });
}