window.onload = function () {
user = JSON.parse(localStorage.getItem('User')) || [];   
user[0]={contato: 'email@email.com', endereço: 'Av. Paulista, São Paulo - SP, Brasil'}
console.log(user[0]);

}