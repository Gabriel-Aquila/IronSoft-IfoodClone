function voltar() {
    window.history.back(); // Volta para a página anterior
}

fetch('/estabelecimentos')
    .then(response => response.json())
    .then(data => {
        const estabelecimentoList = document.getElementById('estabelecimento-list');
        data.forEach(estabelecimento => {
            const li = document.createElement('li');
            li.textContent = `Nome: ${estabelecimento.nome}, especialidade: ${estabelecimento.especialidade}, endereco: ${estabelecimento.endereco}`;
            estabelecimentoList.appendChild(li);
        });
    })
    .catch(error => console.error('Erro ao obter estabelecimentos:', error));
