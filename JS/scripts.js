const LS = localStorage;

const users = JSON.parse(LS.getItem('users')) || [];

if(location.href.indexOf('sobre.html')>=0 && !users.filter(p=>p.logged===true).length>0) {
    location.href = './index.html'
    alert('Você precisa logar com um usuário')
}

if(location.href.indexOf('sobre.html')>=0) {
    document.querySelector('#userLogged').innerHTML = users.find(user => user.logged === true).username;
    updateMessages();
}

const password = document.querySelector('#password');
const eye = document.querySelector('#eye');

eye.addEventListener('mousedown', () => password.type = 'text');
eye.addEventListener('mouseup', () => password.type = 'password');
eye.addEventListener('mousemove', () => password.type = 'password');

function onClickCreateUser(event) {
    event.preventDefault();

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

    found = checkInputs(usernameValue, passwordValue, repeatPasswordValue);

    if(!found){
        alert('Seu usuário precisa ter mais de 3 caractéres, e sua senha, mais de 6')
    }

    clearFields(username, password, repeatPassword);
    switchForm();
}

function checkInputs(username, password, repeatPassword) {
    found = false;
    
    if(username.length > 3 && password.length > 6 && password === repeatPassword) {
        users.push(createNewUser(username, password));
        LS.setItem('users', JSON.stringify(users));
        found = true;
        alert('Usuário criado com sucesso');
    }

    return found;
}

function createNewUser(username, password) {
    const newUser = {
        username: username,
        password: password,
        messages: [],
        logged: false
    }

    return newUser;
}

function onClickLogIn(event) {
    event.preventDefault();
    const username = document.querySelector('#username');
    const password = document.querySelector('#password');

    const usernameValue = username.value.toUpperCase();
    const passwordValue = password.value.toUpperCase();

    if(!users.filter(index => index.username===usernameValue&&index.password===passwordValue ? index.logged = true : '').length > 0) {
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
    const description = document.querySelector('#descriptionCRUD')
    const text = document.querySelector('#textCRUD');

    checkMessage(description, text, userLogged);
    
    description.value = ''; 
    text.value = '';
}

function checkMessage(description, text, userLogged) {
    if(description.value.length>=5 && text.value.length>=5) {
        userLogged.messages.push({
            messageId: Math.floor(Math.random() * 65536),
            description: description.value,
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
    let count = 1;
    getUsers.find(p=>p.logged===true).messages.map(message => {
        contentCRUD.innerHTML += `
        <tr data-id="${message.messageId}">
            <th>${count}</th>
            <td>${message.description}</td>
            <td>${message.textMessage}</td>
            <td>
                <a class="btn btn-danger" href="#" onclick="removeMessage(event)" id="btnDelete">Apagar</a>
                <a class="btn btn-success" href="#" onclick="editMessage(event)" id="btnEdit">Editar</a>
            </td>
        </tr>`
    count++;
    })
}

function removeMessage(event) {
    const dataId = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'));
    users.find(userLogged => userLogged.logged === true).messages = users.find(userLogged => userLogged.logged === true).messages.filter(m => m.messageId !== dataId)
    LS.setItem('users', JSON.stringify(users));
    updateMessages();
}

function editMessage(event) {
    const dataId = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'));
    const changeDescription = prompt(`Qual o novo descritivo? Se quiser continuar com o mesmo, digite ${dataId}`);
    const changeText = prompt(`Qual o novo detalhamento? Se quiser continuar com o mesmo, digite ${dataId}`);
    if(changeDescription.length >= 5 && changeText == dataId) {
        users.find(userLogged => userLogged.logged === true).messages.filter(m => m.messageId === dataId ? m.description = changeDescription : '')
        LS.setItem('users', JSON.stringify(users));
        updateMessages();
        console.log("mudar a descrição");
    } else if (changeDescription == dataId && changeText.length >= 5) {
        users.find(userLogged => userLogged.logged === true).messages.filter(m => m.messageId === dataId ? m.textMessage = changeText : '')
        LS.setItem('users', JSON.stringify(users));
        updateMessages();
        console.log("mudar o texto");
    } else if (changeDescription.length >= 5 && changeText.length >= 5) {
        users.find(userLogged => userLogged.logged === true).messages.filter(m => {
            if(m.messageId === dataId) {
                m.description = changeDescription;
                m.textMessage = changeText;
            }
        })
        LS.setItem('users', JSON.stringify(users));
        updateMessages();
        console.log("mudar os dois");
    } else {
        alert('Digite pelo menos 5 caractéres');
    }
}