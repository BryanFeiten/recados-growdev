function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function onRepeatPassword(event) {
    const password = document.querySelector('#createPassword');
    const repeatPassword = event.target;
    const btnCreateUser = document.querySelector('#btnCreateUser');
    if(password.value === repeatPassword.value) {
        btnCreateUser.disabled = false;
    } else if (password.value !== repeatPassword.value){
        btnCreateUser.disabled = true;
    }
}

function onModalDissmiss() {
    document.getElementById('userRegistration').click();
}

function onClickCreateUser(event) {
    event.preventDefault();
    const users = getUsers();
    let found = false;
    const username = document.querySelector('#createUser')
    const password = document.querySelector('#createPassword')
    const repeatPassword = document.querySelector('#repeatPassword')
    const usernameValue = username.value.toUpperCase();
    const passwordValue = password.value.toUpperCase();
    const repeatPasswordValue = repeatPassword.value.toUpperCase();
    if(users.filter(p=>p.username===usernameValue).length > 0) {
        alert('Já existe um usuário com o mesmo nome! Escolha outro.')
        return
    }
    if(passwordValue !== repeatPasswordValue) {
        alert('Sua confirmação de senha está diferente da original');
        return
    }
    found = checkInputs(users, usernameValue, passwordValue, repeatPasswordValue);
    if(!found){
        alert('Seu usuário precisa ter mais de 3 caractéres, e sua senha, mais de 6')
    }
}


function checkInputs(users, username, password, repeatPassword) {
    found = false;
    if(username.length > 3 && password.length > 6 && password === repeatPassword) {
        users.push(createNewUser(username, password));
        localStorage.setItem('users', JSON.stringify(users));
        found = true;
        alert('Usuário criado com sucesso');
        location.href = "./index.html"
    }
    return found;
}

function createNewUser(username, password) {
    const newUser = {
        userId: Math.floor(Math.random() * 99999) + Math.floor(Math.random() * 99999),
        username,
        password,
        messages: [],
        logged: false
    }
    return newUser;
}

