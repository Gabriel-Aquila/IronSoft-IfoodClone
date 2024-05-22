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
        }, index * 10000); // Delay each request by 10 seconds
    });
};
