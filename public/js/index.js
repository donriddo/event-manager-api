$(() => {
    $('#loginButton').click((evt) => {
        evt.preventDefault();
        $.post('http://localhost:37337/api/login', { email: $('#email').val(), password: $('#password').val() })
        .done((data) => {
            $('#errorBox').hide();
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userObject', JSON.stringify(data.user));
            window.location.replace('/');
            console.log({data});
        })
        .fail((err) => {
            console.log({err: err.responseJSON});
            $('#errorBox').html(err.responseJSON.message);
            $('#errorBox').show();
        });
    });

    $('#signupButton').click((evt) => {
        evt.preventDefault();
        $.post('http://localhost:37337/api/user', { email: $('#email').val(), password: $('#password').val() })
        .done((data) => {
            $('#errorBox').hide();
            window.location.replace('/');
            console.log({data});
        })
        .fail((err) => {
            console.log({err})
            $('#errorBox').html(err.responseJSON.message);
            $('#errorBox').show();
        });
    });
});