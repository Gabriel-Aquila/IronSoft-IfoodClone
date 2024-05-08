const buttonSms =document.getElementById('smsForm');

buttonSms.addEventListener('submit', function(event) {
    const recipient = document.getElementById('recipient').value;

    fetch('/send-sms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipient: recipient,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
