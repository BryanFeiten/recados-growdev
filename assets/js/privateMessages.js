checkLogin();

function checkLogin() {
    const users = getUsers();
    const userLogged = users.find(user => user.logged===true);
    if(userLogged) {
        document.querySelector('#userLogged').innerHTML = userLogged.username;
        updateMessages();
    } else {
        location.href = './index.html';
        alert('Você precisa logar com um usuário');
    }
}

function listRecipients() {
    const recipient = document.querySelector('#chooseRecipient');
    const users = getUsers();
    const userLogged = users.find(user => user.logged === true);
    recipient.innerHTML = '';
    users.map(user => {
        userLogged !== user ? recipient.innerHTML += `<option value=${user.username}>${user.username}</option>` : '';
    })
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function onClickLogOut(event) {
    event.preventDefault();
    const users = getUsers();
    users.find(user => user.logged === true).logged = false;
    updateUsers(users);
    location.href = './index.html';
}

function saveCRUD(event) {
    event.preventDefault();
    const users = getUsers();
    const messages = getPrivateMessages();
    const senderId = users.find(p=>p.logged===true).userId;
    const recipientId = users.find(user => user.username === document.querySelector('#chooseRecipient').value).userId;
    const text = document.querySelector('#textCRUD');

    checkMessage(senderId, recipientId, text, messages);
}

function checkMessage(senderId, recipientId, text, messages) {
    const dateNow = new Date();
    const hourNow  = dateNow.getHours();
    const min     = dateNow.getMinutes();
    const sec     = dateNow.getSeconds();
    const msec    = dateNow.getMilliseconds();
    const date    = `${dateNow.getDate()}/${dateNow.getMonth() + 1}/${dateNow.getFullYear()}`;
    const hours    = `${hourNow}:${min}`;
    const fullHours    = `${hourNow}:${min}:${sec}:${msec}`;

    if(text.value.length>=5) {
        messages.push({
            senderId,
            recipientId,
            messageId: Math.floor(Math.random() * 99999) + Math.floor(Math.random() * 99999),
            textMessage: text.value,
            date,
            hours,
            fullHours,
        });
        text.value = '';
        updateMessages(messages);
    } else {
        alert("Digite uma mensagem com pelo menos 5 caracteres!")
    }
}

function updateMessages(newMessages) {
    const users = getUsers();
    const messages = newMessages || getPrivateMessages();
    const contentCRUD = document.querySelector('#contentCRUD');
    contentCRUD.innerHTML = '';
    let count = 1;
    const userLogged = users.find(p=>p.logged===true);
    messages.map(message => {
        const userOfMessage = users.find(user => user.userId === message.senderId).username
        if(userLogged.userId === message.senderId) {      
        contentCRUD.innerHTML += `
        <tr data-id="${message.messageId}">
            
            <td class="col-1 h6 bg-primary text-white border-rounded">${count} - ${userOfMessage}<span class="text-min"><br>${message.date} - ${message.hours}h${message.edited === true ? '*' : ''}</span></td>
            <td class="col-5">${message.textMessage}</td>
            <td class="col-2 text-center">
                <a class="btn btn-danger p-1" href="#" onclick="removeMessage(event)" id="btnDelete">Apagar</a>
                <a class="btn btn-success p-1" data-bs-toggle="modal" data-bs-target="#editMessage" href="#" onclick="addIdForEditList(event)" id="btnEdit">Editar</a>
            </td>
        </tr>`
    count++;
        } else if (message.recipientId === userLogged.userId) {
            contentCRUD.innerHTML += `
            <tr data-id="${message.messageId}">
                <td class="col-1 h6 bg-secondary text-white border-rounded">${count} - ${userOfMessage}<span class="text-min"><br>${message.date} - ${message.hours}h</span></td>
                <td class="col-5">${message.textMessage}</td>
                <td class="col-2 text-center text-min">Mensagem de outro usuário</td>
            </tr>`
    count++;
        }
    });
    loadMessages(messages);
}

function loadMessages(messages) {
    localStorage.setItem('privateMessages', JSON.stringify(messages))
}

function removeMessage(event) {
    const dataId = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'));
    let messages = getPrivateMessages();
    messages = messages.filter(message => message.messageId !== dataId);
    updateMessages(messages);
}

function editMessage() {
    const dataId = parseInt(document.querySelector('#editMessageId').getAttribute('data-id'));
    const privacityMessage = document.querySelector('#editFormCRUD').editPrivacityMessage.value;
    const changeDescription = document.querySelector('#editDescriptionCRUD').value;
    const changeText = document.querySelector('#editTextCRUD').value;
    const messages = getPrivateMessages();
    if(changeDescription.length >= 4 && changeText.length >= 4) {
        messages.filter(message => {
            if(message.messageId === dataId) {
                message.privacityMessage = privacityMessage;
                message.description = changeDescription;
                message.textMessage = changeText;
                message.edited = true;
            }
        })
        updateMessages(messages);
    } else {
        alert('Necessário mais de 4 caractéres');
    }
}

function addIdForEditList(event) {
    const dataId = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'));
    const messages = getPrivateMessages();
    const message = messages.find(message => message.messageId === dataId);
    const spanMessageId = document.querySelector('#editMessageId');
    spanMessageId.setAttribute('data-id', dataId)
    spanMessageId.innerHTML = `(${dataId})`;
    const changeDescription = document.querySelector('#editDescriptionCRUD');
    const changeText = document.querySelector('#editTextCRUD');
    changeDescription.value = message.description;
    changeText.value = message.textMessage;
}

function getPrivateMessages() {
    return JSON.parse(localStorage.getItem('privateMessages')) || [];
}

function updateUsers(newUsers) {
    const users = newUsers || getUsers();
    localStorage.setItem('users', JSON.stringify(users));
}