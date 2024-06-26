const button = document.querySelector("button")
const modal = document.querySelector("dialog")
const modalConteudo = document.getElementById('modalConteudo');

window.onload = function () {
    console.log("inicio");
    fetch('/consultarEstabelecimento')
        .then(response => response.json())
        .then(data => {
            const estabelecimentosDiv = document.getElementById('estabelecimentos');
            const ol = document.getElementById('list');
            data.estabelecimentos.forEach(estabelecimento => {

            const estabelecimentoDiv = document.createElement('div');
            estabelecimentoDiv.classList.add('estabelecimentoDiv');
            estabelecimentoDiv.style.width="300px";

            const link = document.createElement('a');
            let nomeEstabelecimento = estabelecimento.nome;
            link.setAttribute('href', '/produto/'+nomeEstabelecimento);
            link.setAttribute('data-id', estabelecimento.id_estabelecimento);

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

            link.classList.add('estabelecimentos');
            estabelecimentoDiv.appendChild(imgDiv);
            estabelecimentoDiv.appendChild(textoDiv);
            link.appendChild(estabelecimentoDiv);
            estabelecimentosDiv.appendChild(link);

            link.addEventListener('click', function() {
                const idEstabelecimento = this.getAttribute('data-id');
                localStorage.setItem('idEstabelecimento', idEstabelecimento);
                localStorage.setItem("endereco_Estabelecimento",JSON.stringify(estabelecimento.endereco)) 
            });
        });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));

}