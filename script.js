$(document).ready(function() {
    $('.js-example-basic-single').select2({
        placeholder: 'Escolha um restaurante',
        language: {
            noResults: function() {
                return 'Entre em contato caso não encontre seu restaurante';
            }
        },
        escapeMarkup: function(markup) {
            return markup;
        }
    });

    $('#restaurantForm').on('submit', function(event) {
        event.preventDefault();

        let name = $('#name').val();
        let email = $('#email').val();
        let restaurant = $('#restaurant').val();

        if (name.length < 3) {
            alert("Nome deve ter no mínimo 3 caracteres.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Digite um email válido.");
            return;
        }

        if (!restaurant) {
            alert("Escolha um restaurante.");
            return;
        }

        let formData = {
            name: name,
            email: email,
            restaurant: restaurant
        };

        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/submit',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                window.location.href = 'ranking.html';
            },
            error: function(error) {
                alert('Erro ao enviar o formulário.');
            }
        });
    });

    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
});
