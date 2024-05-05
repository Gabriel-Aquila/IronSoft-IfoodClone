let itens = [];
let buttonModal = document.getElementById('modalButton');
buttonModal.onclick = function () {
    modal.showModal();
    listarDados();
    
}
function listarDados() {
    const ul = document.getElementById('modalConteudo');
    ul.style.listStyleType="none";
    modalConteudo.innerText="";
    itens = JSON.parse(localStorage.getItem(localStorage.key(0))) || [];
    if (itens.length === 0) {
        const divModal = document.createElement('div');
        divModal.innerHTML = "Sua sacola está vazia.";
        divModal.classList.add('divModal');
        divModal.style.width = "300px";
        divModal.style.display = "flex";
        divModal.style.padding = "5px";
        divModal.style.margin = "5px";
        divModal.style.textAlign = "center";
        divModal.style.alignItems = "center"; 
        divModal.style.justifyContent = "space-between"; 
        ul.appendChild(divModal);
    } else {
        itens.forEach((item,index) =>{
            const divModal = document.createElement('div')
            divModal.innerHTML="";
            divModal.classList.add('divModal');
            divModal.style.width="300px";
            divModal.style.display ="flex";
            divModal.style.padding="5px";
            divModal.style.margin="5px";


            const li = document.createElement('li');
            li.textContent = `${item.nome}  R$:${item.preco},00  ${item.quantidade}`;
            console.log(localStorage.getItem(localStorage.key(0)))
            li.style.margin="5px";
            li.style.textDecoration="none";

            const addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.addEventListener('click', function() {
                item.quantidade++; // Incrementa a quantidade
                li.textContent = `${item.nome}  R$:${item.preco},00    ${item.quantidade}`;
                localStorage.setItem("Itens",JSON.stringify(itens)) 
            });

            const removeButton = document.createElement('button');
            removeButton.textContent = '-';
            removeButton.addEventListener('click', function() {
                if (item.quantidade >= 1) { 
                    item.quantidade--;
                    if (item.quantidade == 0) { 
                        itens.splice(index,1);
                        divModal.remove(); 
                        console.log('Item Deletado :', item);
                    }
                    li.textContent = `${item.nome}  R$:${item.preco},00    ${item.quantidade}`;
                    localStorage.setItem("Itens",JSON.stringify(itens)) 
                }
            });

            divModal.appendChild(li);
            divModal.appendChild(addButton);
            divModal.appendChild(removeButton);
            modalConteudo.appendChild(divModal);
        })
        const payButton = document.createElement('button');
        payButton.textContent = 'Escolher forma de Pagamento';
        const linkPayment = document.createElement('a');
        linkPayment.setAttribute('href', '/Pagamento/pagamento');
        linkPayment.appendChild(payButton);
        ul.appendChild(linkPayment);
    }
}

