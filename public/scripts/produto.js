const button = document.querySelector("button")
const modal = document.querySelector("dialog")
const modalConteudo = document.getElementById('modalConteudo');
let buttonDiv 

window.onload = function () {
    console.log("inicio produto");
    fetch('/consultarProduto')
    .then(response => response.json())
    .then(data => {
        const produtosDiv = document.getElementById('produtos');
        produtosDiv.style.justifyContent="center";
        data.produtos.forEach(produto => {

        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produtoDiv');
        produtoDiv.style.width="300px";
        produtoDiv.style.display ="flex";
        produtoDiv.style.alignItems ="center";


        const link = document.createElement('a');
        link.classList.add('linkProdutoDiv');
        link.style.textDecoration="none";
        link.style.color="inherit";
        link.style.margin="10px";
        nomeEstabelecimento = produto.nome
        link.setAttribute('href', '');

        
        const textoDiv = document.createElement('div');
        textoDiv.classList.add('textoDiv');
        textoDiv.innerHTML =`${produto.nome} R$:${produto.preco},00`;

        buttonDiv = document.createElement('button');
        buttonDiv.classList.add('buttonDiv');
        buttonDiv.textContent = 'Adicionar'; 
        buttonDiv.addEventListener('click', function() {
            item = {
                nome: produto.nome,
                preco: produto.preco
            };
            itens.push(item)
            localStorage.setItem("Itens",JSON.stringify(itens))
            console.log('Item adicionado:', item);
        });
        
        link.appendChild(textoDiv);
        produtoDiv.appendChild(link);
        produtoDiv.appendChild(buttonDiv);
        produtosDiv.appendChild(produtoDiv);
    });
})
.catch(error => console.error('Erro ao buscar os dados:', error));
}

