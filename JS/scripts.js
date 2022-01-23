const LS = localStorage;

const users = JSON.parse(LS.getItem('users')) || [];

if(location.href.indexOf('sobre.html')>=0 && !users.filter(p=>p.logged===true).length>0) {
    location.href = './index.html'
    alert('Você precisa logar com um usuário')
}

if(location.href.indexOf('sobre.html')>=0) {
    document.querySelector('#userLogged').innerHTML = users.find(user => user.logged === true).name;
    const containerCRUD = document.querySelector('.contentCRUD');
    updateMessages();
}
 

function onClickCreateUser(event) {
    event.preventDefault();

    let found = false;

    const name = document.querySelector('#createUser')
    const password = document.querySelector('#createPassword')
    const repeatPassword = document.querySelector('#repeatPassword')

    const nameValue = name.value.toUpperCase();
    const passwordValue = password.value.toUpperCase();
    const repeatPasswordValue = repeatPassword.value.toUpperCase();

    if(users.filter(p=>p.name===nameValue).length > 0) {
        alert('Já existe um usuário com o mesmo nome! Escolha outro.')
        return
    }

    if(passwordValue !== repeatPasswordValue) {
        alert('Sua confirmação de senha está diferente da original');
        return
    }

    found = checkInputs(nameValue, passwordValue, repeatPasswordValue);

    if(!found){
        alert('Seu usuário precisa ter mais de 3 caractéres, e sua senha, mais de 6')
    }

    clearFields(name, password, repeatPassword);
}

function checkInputs(name, password, repeatPassword) {
    found = false;
    
    if(name.length > 3 && password.length > 6 && password === repeatPassword) {
        users.push(createNewUser(name, password));
        LS.setItem('users', JSON.stringify(users));
        found = true;
        alert('Usuário criado com sucesso');
    }

    return found;
}

function createNewUser(name, password) {
    const newUser = {
        name: name,
        password: password,
        messages: [],
        logged: false
    }

    return newUser;
}

function onClickLogIn(event) {
    event.preventDefault();
    const name = document.querySelector('#name');
    const password = document.querySelector('#password');

    const nameValue = name.value.toUpperCase();
    const passwordValue = password.value.toUpperCase();

    if(!users.filter(index => index.name===nameValue&&index.password===passwordValue ? index.logged = true : '').length > 0) {
        alert('Nome ou senha incorreto(s)')
        return
    } else {
        LS.setItem('users',JSON.stringify(users))
    };
    
    location.href = './sobre.html'
}

function clearFields(Field_1, Field_2, Field_3) {
    Field_1.value = '';
    Field_2.value = '';
    try {
        Field_3.value = '';
    } catch (error) {
        console.log("O 3º campo não existe");
    };
}

function onClickLogOut(event) {
    event.preventDefault();

    let usersLog = users.filter(p=>p.logged===true);
    for(let uL of usersLog) {
        uL.logged = false
    }
    LS.setItem('users', JSON.stringify(users));
    location.href = './index.html'
}

function switchForm(event) {
    let formActive = event.parentNode;
    const login = document.querySelector('#form-login');
    const register = document.querySelector('#form-register');

    login.removeAttribute('class', 'disabled');
    register.removeAttribute('class', 'disabled');

    formActive.classList.add('disabled');
}

function saveCRUD(event) {
    event.preventDefault();

    const userLogged = users.find(p=>p.logged===true);
    const text = document.querySelector('#inputCRUD');

    checkMessage(text, userLogged);
    
    text.value = '';
}

function checkMessage(text, userLogged) {
    if(text.value.length>=5) {
        userLogged.messages.push({
            messageId: Math.floor(Math.random() * 65536),
            textMessage: text.value,
        });
        LS.setItem('users', JSON.stringify(users));
        updateMessages();
    } else {
        alert("Digite uma mensagem com pelo menos 5 caracteres!")
    }
}

function updateMessages() {
    const getUsers = JSON.parse(localStorage.getItem('users'));
    const contentCRUD = document.querySelector('#contentCRUD');
    contentCRUD.innerHTML = '';
    getUsers.find(p=>p.logged===true).messages.map(message => contentCRUD.innerHTML += `<div class="message" data-id="${message.messageId}"><p>${message.textMessage}</p><div class="controllMessage"><a href="#" onclick="editMessage(event)" id="btnEdit">Editar</a><a href="#" onclick="removeMessage(event)" id="btnDelete">Delete</a></div></div>`);
}

function removeMessage(event) {
    const dataId = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'));
    users.find(userLogged => userLogged.logged === true).messages = users.find(userLogged => userLogged.logged === true).messages.filter(m => m.messageId !== dataId)
    LS.setItem('users', JSON.stringify(users));
    updateMessages();
}

function editMessage(event) {
    const dataId = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'));
    const changeForThis = prompt('Qual a nova descrição?');
    if(changeForThis.length>=4) {
        users.find(userLogged => userLogged.logged === true).messages.filter(m => m.messageId === dataId ? m.textMessage = changeForThis : '')
        LS.setItem('users', JSON.stringify(users));
        updateMessages();
    } else {
        alert('Digite pelo menos 4 caractéres')
    }
}