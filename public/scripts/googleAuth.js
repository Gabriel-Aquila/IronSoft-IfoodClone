
function handleCredentialResponse(response) {
  const data = jwtDecode(response.credential)
  fetch('/criarClientedb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: data.name,
      email: data.email,
      telefone:'400028922'
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Resposta do servidor:', data);
  })
  .catch(error => {
    console.error('Erro ao fazer requisição:', error);
  });
  console.log(data)
}
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "1001675675965-o4j8qf2erudbvvbjfd7f88ld5tff8dt1.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });


    google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", 
      size: "large",
      type:"standard",
      shape:"rectangular",
      text:"$ {button.text}",
      locale:"pt-BR",
      logo_alignment:"left",
      width:"350",
      
      
    }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
}