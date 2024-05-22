const divResumo = document.getElementById('resumo');
const divEndereço = document.getElementById('endereço');
const buttonPagamento = document.getElementById('pay');

window.onload = function () {

    // Resumo
    const itens = JSON.parse(localStorage.getItem(localStorage.key(0))) || [];
    let total = 0;
    let id_estabelecimento;
    itens.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.nome}  R$:${item.preco},00  ${item.quantidade}x`;
        console.log(localStorage.getItem(localStorage.key(0)));
        li.style.margin = "5px";
        li.style.textDecoration = "none";
        total += parseFloat(item.preco);
        id_estabelecimento = item.id_estabelecimento;
        divResumo.appendChild(li);
    });

    fetch(`/consultarIDEstabelecimento/${id_estabelecimento}`)
        .then(response => response.json())
        .then(data => {
            const estabelecimento = data.estabelecimentos[0].nome;

            const estabelecimentop = document.createElement('p');
            const cupomP = document.createElement('p');
            const totalP = document.createElement('p');
            const subtotalP = document.createElement('p');
            const taxalP = document.createElement('p');

            estabelecimentop.innerHTML = `Seu pedido em: ${estabelecimento}`;
            cupomP.innerHTML = `Código do cupom: `;
            subtotalP.innerHTML = `Subtotal:  ${total}`;
            taxalP.innerHTML = `Taxa de entrega: 0`;
            totalP.innerHTML = `Total:  ${total}`;

            divResumo.appendChild(estabelecimentop);
            divResumo.appendChild(cupomP);
            divResumo.appendChild(subtotalP);
            divResumo.appendChild(taxalP);
            divResumo.appendChild(totalP);
        })
        .catch(error => console.error('Erro ao buscar os dados:', error));

    // Endereço
    const user = JSON.parse(localStorage.getItem('User')) || [];
    console.log(user);
    const enderecoP = document.createElement('p');
    enderecoP.innerHTML = `Entrega: ${user[user.length - 1].endereço}`;
    divEndereço.appendChild(enderecoP);
}

buttonPagamento.addEventListener('click', function() {
    const user = JSON.parse(localStorage.getItem('User')) || [];
    const email = user[0].contato;
    console.log(email);
    fetch('/confirmar-pagamento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'email=' + encodeURIComponent(email)
    })
    .then(response => {
        if (response.ok) {
        } else {
            throw new Error('Erro ao enviar confirmação.');
        }
    })
    .catch(error => {
        console.error(error);
    });
    window.open("/status-pedido")
});
