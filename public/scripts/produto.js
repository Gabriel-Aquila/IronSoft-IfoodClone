const button = document.querySelector("button")
const modal = document.querySelector("dialog")
const modalConteudo = document.getElementById('modalConteudo');
let quantidade =0;
let buttonDiv 

window.onload = function () {
    console.log("inicio produto");
    const id_estabelecimento = localStorage.getItem('idEstabelecimento');
    fetch(`/consultarProduto?id_estabelecimento=${id_estabelecimento}`)
    .then(response => response.json())
    .then(data => {
        const produtosDiv = document.getElementById('produtos');
        produtosDiv.style.justifyContent="center";
        data.produtos.forEach(produto => {

        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produtoDiv');
        produtoDiv.style.width="300px";
        produtoDiv.style.display ="flex";
        produtoDiv.style.alignItems ="right";


        const link = document.createElement('a');
        link.classList.add('linkProdutoDiv');
        link.style.textDecoration="none";
        link.style.color="inherit";
        link.style.margin="10px";
        link.setAttribute('href', '');

        
        const textoDiv = document.createElement('div');
        textoDiv.classList.add('textoDiv');
        textoDiv.innerHTML =`${produto.nome} R$:${produto.preco},00`;

        buttonDiv = document.createElement('button');
        buttonDiv.classList.add('buttonDiv');
        buttonDiv.textContent = '+'; 
        buttonDiv.addEventListener('click', function() {
            let itemExistente = itens.find(item => item.nome === produto.nome); // Verifica se o item já está na cesta
            if (itemExistente) {
                itemExistente.quantidade++; // Incrementa a quantidade do item existente
            } else {
                itens.push({ nome: produto.nome, preco: produto.preco, quantidade: 1 ,id_estabelecimento: id_estabelecimento }); // Adiciona um novo item à cesta
            }
            localStorage.setItem('Itens', JSON.stringify(itens));
            console.log('Item adicionado:', produto);
        });
        
        link.appendChild(textoDiv);
        produtoDiv.appendChild(link);
        produtoDiv.appendChild(buttonDiv);
        produtosDiv.appendChild(produtoDiv);
    });
})
.catch(error => console.error('Erro ao buscar os dados:', error));
}

