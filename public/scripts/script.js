function voltar() {
    window.history.back();
}

// GOOGLE MAPS 

var map;
var marker;

function updateMap(location, formattedAddress) {
    const map = new google.maps.Map(document.getElementById('mapFrame'), {
        zoom: 15,
        center: location,
    });

    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: formattedAddress,
        draggable: false,
    });

    document.getElementById('streetName').textContent = formattedAddress;

    google.maps.event.addListener(marker, 'dragend', function (event) {
        updateMap(event.latLng, formattedAddress);
    });
}

document.getElementById('oPopup').addEventListener('click', function() {
    document.getElementById('addressPopup').style.display = 'block';
    document.getElementById('mapFrame').src = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14624.038472826107!2d-46.6029821!3d-23.603987999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1713125557943!5m2!1spt-BR!2sbr";

    document.getElementById('addressInput').value = '';

    document.getElementById('streetName').textContent = '';

    initMap();
});

document.getElementById('addressPopup').addEventListener('click', function(event) {
    if (event.target === document.getElementById('addressPopup')) {
        document.getElementById('addressPopup').style.display = 'none';
    }
});

document.getElementById('locateAddress').addEventListener('click', function () {
    var address = document.getElementById('addressInput').value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            var location = results[0].geometry.location;
            var formattedAddress = results[0].formatted_address;

            updateMap(location, formattedAddress);
        } else {
            alert('Não foi possível localizar o endereço. Por favor, tente novamente.');
        }
    });
});

//////////////////////////////////////////

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