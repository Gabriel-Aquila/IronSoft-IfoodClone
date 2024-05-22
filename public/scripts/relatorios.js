// scripts/relatorios.js

document.addEventListener("DOMContentLoaded", function() {
    // Relatório de Vendas por Dia da Semana
    fetch('/relatorio-vendas-por-dia')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('vendasPorDiaChart').getContext('2d');
            const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            const valores = Array(7).fill(0);
            
            data.data.forEach(item => {
                valores[item.dia_semana] = item.total;
            });
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: diasDaSemana,
                    datasets: [{
                        label: 'Total de Vendas',
                        data: valores,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });

    // Relatório de Faturamento por Restaurante
    fetch('/relatorio-faturamento-por-restaurante')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('faturamentoPorRestauranteTable').getElementsByTagName('tbody')[0];
            data.data.forEach(item => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = item.restaurante;
                row.insertCell(1).textContent = `R$ ${item.faturamento.toFixed(2)}`;
                const faturamentoPorCliente = item.clientes > 0 ? (item.faturamento / item.clientes).toFixed(2) : 'N/A';
                row.insertCell(2).textContent = `R$ ${faturamentoPorCliente}`;
                row.insertCell(3).textContent = item.quantidade_vendas;
            });
        });

    // Relatório de Vendas por Produto
    fetch('/relatorio-vendas-por-produto')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('vendasPorProdutoTable').getElementsByTagName('tbody')[0];
            data.data.forEach(item => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = item.produto;
                row.insertCell(1).textContent = `R$ ${item.preco.toFixed(2)}`;
                const faturamentoPorCliente = item.clientes > 0 ? (item.faturamento / item.clientes).toFixed(2) : 'N/A';
                row.insertCell(2).textContent = `R$ ${item.faturamento.toFixed(2)}`;
                row.insertCell(3).textContent = `R$ ${faturamentoPorCliente}`;
                row.insertCell(4).textContent = item.quantidade_vendas;
            });
        });
});
