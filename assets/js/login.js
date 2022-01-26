checkLogin();

function checkLogin() {
    const users = getUsers();
    const userLogged = users.find(user => user.logged===true);
    if(userLogged) {
        location.href = "./about.html"
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function onClickLogIn(event) {
    event.preventDefault();
    const users = getUsers();
    const username = document.querySelector('#username');
    const password = document.querySelector('#password');
    const usernameValue = username.value.toUpperCase();
    const passwordValue = password.value.toUpperCase();
    if(!users.filter(index => index.username===usernameValue&&index.password===passwordValue ? index.logged = true : '').length > 0) {
        alert('Nome ou senha incorreto(s)')
        return
    } else {
        localStorage.setItem('users',JSON.stringify(users))
    };
    
    location.href = './about.html'
}