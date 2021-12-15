import './index.html';
import './style.css';
import './imageserver.js'

const status = document.querySelector('.chat__title');
const messages = document.querySelector('.chat__body');
const sendBtn = document.querySelector('.btn--send-message');
const authorizationBtn = document.querySelector('.btn--authorization');
const inputAuthorization = document.querySelector('.authorization__input');
const inputMessage = document.querySelector('.chat__input');
const chatPopulation = document.querySelector('.chat__population');
const startingPopup = document.querySelector('.popup--authorization');
const closePopup = document.querySelectorAll('.popup .close');
const bodyApp = document.querySelector('.app');
const peopleList = document.querySelector('.people');
const imageDropZone = document.querySelector('.addphoto__photo-wrap');
export let userName = '';
export let ws = '';

authorizationBtn.addEventListener('click', function(e) {
  e.preventDefault();
  startingPopup.classList.add('hide');
  bodyApp.classList.remove('hide');

  if(inputAuthorization.value != '') {
    userName = inputAuthorization.value;
  } else {
    alert('Ник не должен быть пустым')
  }
  inputAuthorization.value = '';
  ws = new WebSocket('ws://localhost:3000');
  ws.onopen = () => {
    setStatus('Online');
    ws.send(JSON.stringify({type: 'hello', user: userName}))
  };

  ws.onmessage = response => {
    const message = JSON.parse(response.data);
    switch (message.type) {
      case 'hello':
        printMessage(message);
        break;
        
      case 'close':
        printMessage(message);
        break;
  
      case 'numberUser':
        if(message.count === 1) {
          chatPopulation.innerHTML = `${message.count} участник`
        } else {
          chatPopulation.innerHTML = `${message.count} участников`
        }
  
        refreshUsersIntoUserList(message);
        break;

      case 'changePhoto':
        refreshUserPhoto(message);
        break;
        
      case 'messageText':
        printMessage(message);
        break;
    }
  };
  
})

function setStatus(value) {
  status.innerHTML = value;
}

function printMessage(message) {
  const li = document.createElement('li');
  switch (message.type) {
    case 'hello':
      if(!message.IsOwnMessage) {
        li.innerHTML = `
        <div class="chat__message service">
          Пользователь ${message.name} вошел в чат
        </div>
        `;
      }
      break;

    case 'close':
      li.innerHTML = `
      <div class="chat__message service">
        Пользователь ${message.name} покинул в чат
      </div>
      `;
      break;
      
    case 'messageText':
      let ownCSSClass = '';
      if(message.IsOwnMessage) {
        ownCSSClass = 'own-message'
      }
      li.innerHTML = `
      <div class="chat__message ${ownCSSClass}">
        <div class="chat__name">
        ${message.name}
        </div>
        <div class="chat__text-wrap">
          <div class="chat__text">
            ${message.text}
          </div>
          <div class="chat__time">
            ${message.messageTime}
          </div>
          <div class="chat__img" style='background-image: ${message.userPhoto}'  data-iduser='${message.id}'></div>
        </div>
      </div>
      `;
      break;
  }

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

function refreshUsersIntoUserList(userFromList) {
  peopleList.innerHTML = '';
  let listOfUsers = userFromList.usersNameList;
  listOfUsers.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `
      <li class="people__item">
        <div class="people__img" data-iduser='${user.id}' style='background-image: ${user.userPhoto}'></div>
        <div class="people__info">
          <div class="people__nick">${user.userName}</div>
        </div>
      </li>
    `;
  
    peopleList.appendChild(li);
  })
}

function refreshUserPhoto(whoChangingPhoto) {

  let targetChangingPhotoinUserList = document.querySelectorAll(`.people__item .people__img[data-iduser]`);
  targetChangingPhotoinUserList.forEach(targetChangingPhoto => {
    if (whoChangingPhoto.id === targetChangingPhoto.getAttribute("data-iduser")) {
      targetChangingPhoto.style.backgroundImage = `${whoChangingPhoto.userPhoto}`;
    }
  })


  let targetChangingPhotoinChat = document.querySelectorAll(`.chat .chat__img[data-iduser]`);
  targetChangingPhotoinChat.forEach(targetChangingPhoto => {
    if (whoChangingPhoto.id === targetChangingPhoto.getAttribute("data-iduser")) {
      targetChangingPhoto.style.backgroundImage = `${whoChangingPhoto.userPhoto}`;
    }
  })
}

sendBtn.addEventListener('click', function(e) {
  e.preventDefault();
  sendMessage(inputMessage.value);
})

inputMessage.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    sendMessage(inputMessage.value);
  }
})

// ws.onopen = () => {
//   setStatus('Online');
//   ws.send(JSON.stringify({type: 'hello', user: userName}))
// };

// ws.onmessage = response => {
//   const message = JSON.parse(response.data);
//   switch (message.type) {
//     case 'hello':
//       printMessage(message);
//       // addUserIntoUserList(message);
//       break;
      
//     case 'close':
//       printMessage(message);
//       break;

//     case 'numberUser':
//       if(message.count === 1) {
//         chatPopulation.innerHTML = `${message.count} участник`
//       } else {
//         chatPopulation.innerHTML = `${message.count} участников`
//       }

//       refreshUsersIntoUserList(message);
//       break;
      
//     case 'messageText':
//       printMessage(message);
//       break;
//   }
// };

function sendMessage(stringMessage) {
  if (inputMessage.value != '') {
    ws.send(JSON.stringify({type: 'messageText', text: stringMessage}));
  }
  inputMessage.value = '';
  inputMessage.focus();
}

closePopup.forEach(btnClose => {
  btnClose.addEventListener('click', function(e) {
    btnClose.closest('.popup').classList.add('hide');
  })
})














// function observeChildNodes(where) {
//   // Выбираем целевой элемент
//   const target = where;

//   // Конфигурация observer (за какими изменениями наблюдать)
//   const config = {
//     attributes: true,
//     childList: true,
//     subtree: true,
//   };
//   // Колбэк-функция при срабатывании мутации
//   const callback = () => { 
//     ws.send(JSON.stringify({type: 'changePhoto', userPhoto: target.style.backgroundImage})) 
//   };


//   // Создаём экземпляр наблюдателя с указанной функцией колбэка
//   const observer = new MutationObserver(callback);

//   // Начинаем наблюдение за настроенными изменениями целевого элемента
//   observer.observe(target, config);
// }

// observeChildNodes(imageDropZone);