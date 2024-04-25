let itens = [];
button.onclick = function () {
    modal.showModal();
    listarDados();
    
}
function listarDados() {
    const ul = document.getElementById('modalConteudo');
    ul.style.listStyleType="none";
    modalConteudo.innerText="";
    itens = JSON.parse(localStorage.getItem(localStorage.key(0))) || [];
    itens.forEach((item,index) =>{
        const divModal = document.createElement('div')
        divModal.innerHTML="";
        divModal.classList.add('divModal');
        divModal.style.width="300px";
        divModal.style.display ="flex";
        divModal.style.padding="5px";
        divModal.style.margin="5px";


        const li = document.createElement('li');
        li.textContent = `${item.nome}  R$:${item.preco},00`;
        console.log(localStorage.getItem(localStorage.key(0)))
        li.style.margin="5px";
        li.style.textDecoration="none";


        const removeButton = document.createElement('button');

        removeButton.classList.add('removeButton');
        removeButton.textContent = 'Excluir'; 

        removeButton.addEventListener('click', function() {
            itens.splice(index,1);
            divModal.remove(); 
            localStorage.setItem("Itens",JSON.stringify(itens))
            console.log('Item Deletado :', item);
        });

        divModal.appendChild(li);
        divModal.appendChild(removeButton);
        modalConteudo.appendChild(divModal);
    })
}

