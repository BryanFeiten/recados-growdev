checkLogin();
listRecipients();

function checkLogin() {
    const users = getUsers();
    const userLogged = users.find(user => user.logged===true);
    if(userLogged) {
        document.querySelector('#userLogged').innerHTML = userLogged.username;
        // updateMessages();
    } else {
        location.href = './index.html';
        alert('Você precisa logar com um usuário');
    }
}

function listRecipients() {
    const recipient = document.querySelector('#conversations');
    const users = getUsers();
    const userLogged = users.find(user => user.logged === true);
    const messages = getPrivateMessages();
    recipient.innerHTML = '';
    users.map(user => {
        if(userLogged !== user) {
            recipient.innerHTML += `
                <div class="bg-black w-100 p-2 mt-1 target" onclick="getThisUserMessages(${user.userId})">
                    <p class="text-white h5">${user.username}</p>
                </div>`
    };
    })
}

function getThisUserMessages(userId) {
    const userRecipient = document.querySelector('#userRecipient');
    const users = getUsers();
    userRecipient.removeAttribute('data-id');
    userRecipient.innerHTML = users.find(user => user.userId === userId).username;
    userRecipient.setAttribute('data-id', users.find(user => user.userId === userId).userId);
    const container = document.querySelector('#conversation');
    container.innerHTML = '';
    const messages = getPrivateMessages();
    const userLogged = users.find(user => user.logged === true);
    messages.map(message => {
        if(message.senderId === userId) {
            if(message.recipientId === userLogged.userId) {
                container.innerHTML += `<span class="h5 d-flex align-self-start text-left messageReceive">${message.textMessage}</span>`
            }
        } else if(message.recipientId === userId) {
            if(message.senderId === userLogged.userId) {
                container.innerHTML += `<span class="h5 d-flex align-self-end text-right messageSend">${message.textMessage}</span>`
            }
        }
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
    const recipientId = users.find(user => user.userId === parseInt(document.querySelector('#userRecipient').getAttribute('data-id'))).userId;
    const text = document.querySelector('#privateMessageText');
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

    if(text.value.length>0) {
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
        updateThisUserMessages(messages);
    }
}

function updateThisUserMessages(newMessages) {
    const users = getUsers();
    const recipientUser = users.find(user => user.userId === parseInt(document.querySelector('#userRecipient').getAttribute('data-id')));
    const messages = newMessages || getPrivateMessages();
    const container = document.querySelector('#conversation');
    container.innerHTML = '';
    const userLogged = users.find(p=>p.logged===true);
    messages.map(message => {
        if(message.senderId === recipientUser.userId) {
            if(message.recipientId === userLogged.userId) {
                container.innerHTML += `<span class="h5 d-flex align-self-start text-left messageReceive">${message.textMessage}</span>`
            }
        } else if(message.recipientId === recipientUser.userId) {
            if(message.senderId === userLogged.userId) {
                container.innerHTML += `<span class="h5 d-flex align-self-end text-right messageSend">${message.textMessage}</span>`
            }
        }
    });
    loadPrivateMessages(messages);
    getThisUserMessages(recipientUser.userId);
}

function loadPrivateMessages(messages) {
    localStorage.setItem('privateMessages', JSON.stringify(messages))
}

function removeMessage(event) {
    const dataId = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'));
    let messages = getPrivateMessages();
    messages = messages.filter(message => message.messageId !== dataId);
    updateMessages(messages);
}


function getPrivateMessages() {
    return JSON.parse(localStorage.getItem('privateMessages')) || [];
}

function updateUsers(newUsers) {
    const users = newUsers || getUsers();
    localStorage.setItem('users', JSON.stringify(users));
}