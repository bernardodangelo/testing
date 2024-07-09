$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/ranking',
        success: function(response) {
            let rankingTable = $('#rankingTable tbody');
            rankingTable.empty();

            response.forEach(function(item) {
                let row = `<tr>
                    <td>${item.restaurant}</td>
                    <td>${item.votes}</td>
                </tr>`;
                rankingTable.append(row);
            });
        },
        error: function(error) {
            alert('Erro ao carregar o ranking.');
        }
    });
});
