/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';
const homeworkContainer = document.querySelector('#app');

document.addEventListener('mousemove', (e) => {});

export function createDiv() {
  const newDiv = document.createElement('div');
  newDiv.classList.add('draggable-div');
  newDiv.style.top = getRandomNumber(0, 100) + 'vh';
  newDiv.style.left = getRandomNumber(0, 100) + 'vh';
  newDiv.style.width = getRandomNumber(10, 100) + 'px';
  newDiv.style.height = getRandomNumber(10, 100) + 'px';
  newDiv.style.backgroundColor =
    'rgb' +
    '(' +
    getRandomNumber(0, 255) +
    ',' +
    getRandomNumber(0, 255) +
    ',' +
    getRandomNumber(0, 255) +
    ')';
  newDiv.setAttribute('draggable', true);
  return newDiv;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const div = createDiv();
  homeworkContainer.appendChild(div);
});

function getRandomNumber(min, max) {
  const random = Math.random() * (max - min) + min;
  const roundingRandom = Math.round(random);
  return roundingRandom;
}

let currentDrag;

document.addEventListener('dragstart', (e) => {
  currentDrag = { node: e.target };
  e.dataTransfer.setData('text/html', 'dragstart');
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  currentDrag.node.classList.add('hidden');
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  currentDrag.node.classList.remove('hidden');
  currentDrag.node.style.left = e.pageX + 'px';
  currentDrag.node.style.top = e.pageY + 'px';
});
