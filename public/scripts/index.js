const button = document.querySelector("button")
const modal = document.querySelector("dialog")
const modalConteudo = document.getElementById('modalConteudo');

window.onload = function () {
    console.log("inicio");
    fetch('/consultarEstabelecimento')
        .then(response => response.json())
        .then(data => {
            const estabelecimentosDiv = document.getElementById('estabelecimentos');
            data.estabelecimentos.forEach(estabelecimento => {

            const estabelecimentoDiv = document.createElement('div');
            estabelecimentoDiv.classList.add('estabelecimentoDiv');
            estabelecimentoDiv.style.width="300px";

            const link = document.createElement('a');
            link.setAttribute('href', 'https://www.exemplo.com');

            const imgDiv = document.createElement('div');
            const img = document.createElement('img');
            imgDiv.classList.add('imgDiv');
            img.src = '/image/' + 'imagem-teste.png'; // Caminho da imagem
            img.alt = `Imagem de ${estabelecimento.nome}`;
            img.style.width="100px";
            img.style.heigh="100px";
            
            imgDiv.appendChild(img);
            
            const textoDiv = document.createElement('div');
            textoDiv.classList.add('textoDiv');
            textoDiv.innerHTML =`Nome: ${estabelecimento.nome} <br/> Especialidade: ${estabelecimento.especialidade}`;
           
            estabelecimentoDiv.appendChild(imgDiv);
            estabelecimentoDiv.appendChild(textoDiv);
            link.appendChild(estabelecimentoDiv);
            estabelecimentosDiv.appendChild(link);
        });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));

}

button.onclick = function () {
    modal.showModal()
    listarDados()
    
}

function listarDados() {
    fetch('/listarDados') 
        .then(response => response.json())
        .then(data => {
            modalConteudo.innerHTML = '';
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `Nome: ${item.nome}, descricao: ${item.descricao}, preco: ${item.preco}`;
                modalConteudo.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Erro ao obter os dados:', error);
        });
}