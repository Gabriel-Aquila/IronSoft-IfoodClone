const divResumo = document.getElementById('resumo');
const divEndereço = document.getElementById('endereço');
const buttonPagamento = document.getElementById('finalizar_pagamento');

window.onload = function () {

    //Resumo
    itens = JSON.parse(localStorage.getItem(localStorage.key(0))) || [];
    let total = 0;
    let id_estabelecimento;
    itens.forEach((item,index) =>{
        const li = document.createElement('li');
        li.textContent = `${item.nome}  R$:${item.preco},00  ${item.quantidade}x`;
        console.log(localStorage.getItem(localStorage.key(0)))
        li.style.margin="5px";
        li.style.textDecoration="none";
        total += parseFloat(item.preco);
        id_estabelecimento = item.id_estabelecimento;
        divResumo.appendChild(li);
    })
    let estabelecimento;
    fetch(`/consultarIDEstabelecimento/${id_estabelecimento}`)
    .then(response => response.json())
    .then(data => {
        estabelecimento = data.estabelecimentos[0].nome;

        let estabelecimentop = document.createElement('p');
        let cupomP = document.createElement('p');
        let totalP = document.createElement('p');
        let subtotalP = document.createElement('p');
        let taxalP = document.createElement('p');
    
        estabelecimentop.innerHTML=`Seu pedido em: ${estabelecimento}`;
        cupomP.innerHTML=`Código do cupom: `;
        subtotalP.innerHTML=`Subtotal:  ${total}`;
        taxalP.innerHTML=`Taxa de entrega: 0`;
        totalP.innerHTML=`Total:  ${total}`;
    
        divResumo.appendChild(estabelecimentop);
        divResumo.appendChild(cupomP);
        divResumo.appendChild(subtotalP);
        divResumo.appendChild(taxalP);
        divResumo.appendChild(totalP);
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));

    //Endereço
    user = JSON.parse(localStorage.getItem('User')) || [];
    console.log(user);
    let enderecoP = document.createElement('p');;
    enderecoP.innerHTML=`Entrega: ${user[user.length - 1].endereço}`;
    divEndereço.appendChild(enderecoP);

}

buttonPagamento.addEventListener('click', function() {

    let email = user[0].contato;
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
            document.getElementById('verificationPopup').style.display = 'block';
        } else {
            throw new Error('Erro ao enviar código de verificação.');
        }
    })
    .catch(error => {
        console.error(error);
    });
    
});