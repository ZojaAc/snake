// создаем поле
let field = document.createElement('div');
document.body.appendChild(field);
field.classList.add('field');

// разобьем поле на ячейки
for(let i=1; i<101; i++) {
  let excel = document.createElement('div');
  field.appendChild(excel);
  excel.classList.add('excel');
}

// присвоим координаты каждой ячейке
let excel = document.getElementsByClassName('excel');
// excel[0].setAttribute('posX', 'test'); // для пробы присвоили атрибут
// excel[0].setAttribute('posY', 'test');
let x = 1, y = 10;  // для первой ячейки координаты по осям х и у
for(let i=0; i<excel.length; i++) {
  if(x>10) {
    x=1;  // каждые 10 итераций ряд понижается (идем слева направо сверху вниз)
    y--;
  }
  excel[i].setAttribute('posX', x);  // присваиваем каждой ячейке атрибут
  excel[i].setAttribute('posY', y);
  x++;
}

// создаем змейку
function generateSnake() {  // возвращает массив posX & posY
  let posX = Math.round(Math.random() * (10 - 3) + 3);  // posX будет равен любому числу от 1 до 10
  let posY = Math.round(Math.random() * (10 - 1) + 1);
  return [posX, posY];
}
// функция возвращает случайные координаты
let coordinates = generateSnake();
let snakeBody = [document.querySelector('[posX = "' + coordinates[0] + '"][posY = "' + coordinates[1] + '"]'),
document.querySelector('[posX = "' + (coordinates[0]-1) + '"][posY = "' + coordinates[1] + '"]'),
document.querySelector('[posX = "' + (coordinates[0]-2) + '"][posY = "' + coordinates[1] + '"]')];
// coordinates[0] = posX и posY - координаты случайно подобранные функцией
// поиск div по координатам подобранным функцией
// console.log(coordinates);  // проверка - ф-ция подбирает координаты (2) [3, 4]
// console.log(snakeBody);  // проверка - находится сектор по координатам  [div.excel] 0: div.excel, жму, в списке блок с коорд 3,4

// рисуем змея - первому эл-ту массива добавим класс head, остальным класс body
for(let i=0; i<snakeBody.length; i++) {
  snakeBody[i].classList.add('snakeBody');
}
snakeBody[0].classList.add('head');

// создаем мышь
let mouse;
function createMouse() {
  function generateMouse () {
    let posX = Math.round(Math.random() * (10 - 3) + 3);  
    let posY = Math.round(Math.random() * (10 - 1) + 1);
    return [posX, posY];
  }
  let mouseCoordinates = generateMouse();
  // console.log(mouseCoordinates);
  mouse = document.querySelector('[posX = "' + mouseCoordinates[0] + '"][posY = "' + mouseCoordinates[1] + '"]');
  
  // чтобы мышь не совпадала в ячейках со змейкой
  // пишем условие, при совпадении координат обновить поиск координат
  while(mouse.classList.contains('snakeBody')) {
    let mouseCoordinates = generateMouse();
    mouse = document.querySelector('[posX = "' + mouseCoordinates[0] + '"][posY = "' + mouseCoordinates[1] + '"]');
  }
  mouse.classList.add('mouse');
}
createMouse();

let direction = 'right';
let steps = false;

// учет итогов игры
let input = document.createElement('input');
document.body.appendChild(input);
input.style.cssText = `
margin: auto;
margin-top: 40px;
font-size: 30px;
display: block;
`;
let score = 0;
input.value = `Ваши очки: ${score}`;

// научим змейку двигаться вправо
function move() {
  let snakeCoordinates = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')];  // получаем координаты головы
  snakeBody[0].classList.remove('head');  // у тела убираем голову
  snakeBody[snakeBody.length-1].classList.remove('snakeBody');  // убираем хвост
  snakeBody.pop();  // убрали последний элемент

  if(direction == 'right') {
    // чтобы упираясь в край процесс не останавливался
    if(snakeCoordinates[0] < 10) {
      // теперь присваивая соседним ячейкам классы головы, тела мы тем самым сдвигаем змейку
      snakeBody.unshift(document.querySelector('[posX = "' + (+snakeCoordinates[0]+1) + '"][posY = "' + snakeCoordinates[1] + '"]'));
      // теперь голова имеет координаты х+1, у, т.е. сдвинулась вправо
    } else {  // если по х уже 10, нужно сбросить значения (вернутся к левому краю)
      snakeBody.unshift(document.querySelector('[posX = "1"][posY = "' + snakeCoordinates[1] + '"]'));
    }
  }
  // другие направления движения
  else if(direction == 'left') {
    if(snakeCoordinates[0] > 1) {
      snakeBody.unshift(document.querySelector('[posX = "' + (+snakeCoordinates[0]-1) + '"][posY = "' + snakeCoordinates[1] + '"]'));
    } else {  
      snakeBody.unshift(document.querySelector('[posX = "10"][posY = "' + snakeCoordinates[1] + '"]'));
    }
  }
  else if(direction == 'up') {
    if(snakeCoordinates[1] < 10) {  // если движение вверх, проверяем меньше ли у 10
      snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "' + (+snakeCoordinates[1]+1) + '"]'));
    } else {  
      snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "1"]'));
    }
  }
  else if(direction == 'down') {
    if(snakeCoordinates[1] > 1) {
      snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "' + (snakeCoordinates[1]-1) + '"]'));
    } else {  
      snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "10"]'));
    }
  }

  // научим змейку есть мышей (при совпадении ячеек/координат 1.мышь исчезает 2.змейка вырастает 3.появляется новая мышь)
  // пишем условие совпадения координат (если голова змейки совпадает с мышью)
  if(snakeBody[0].getAttribute('posX') == mouse.getAttribute('posX') && 
  snakeBody[0].getAttribute('posY') == mouse.getAttribute('posY')) {
    mouse.classList.remove('mouse');  // убираем мышь
    // получам координаты хвоста и дублируем его в массив змейки
    let a = snakeBody[snakeBody.length - 1].getAttribute('posX');
    let b = snakeBody[snakeBody.length - 1].getAttribute('posY');
    snakeBody.push(document.querySelector('[posX = "' + a + '"][posY = "' + b + '"]'));
    // создаем новую мышь
    createMouse();
    score++;
    input.value = `Ваши очки: ${score}`;
  }

  // установим правила до момента создания змейки
  // если голова попала на саму себя, игра прекращается
  if(snakeBody[0].classList.contains('snakeBody')) {
    setTimeout(() => {
      alert(`Игра окончена, Ваши очки: ${score}`);
    }, 200);    
    clearInterval(interval);  // прекращение повтора функции запуска змейки
    snakeBody[0].style.background = 'url(end.png) center no-repeat';
    snakeBody[0].style.backgroundSize = "cover";
  }

  snakeBody[0].classList.add('head');  // добавили первой ячейке класс головы
  // остальным добавим циклом класс тела
  for(let i=0; i<snakeBody.length; i++) {
    snakeBody[i].classList.add('snakeBody');
  }

  steps = true;
}
// для работы ф-ции с интервалом
let interval = setInterval(move, 300);

// движение змейки во всех направлениях по нажатию стрелки
// у каждой клавиши есть код, у стрелок 37-40
window.addEventListener('keydown', function(e) {
  // при слишком быстром использовании клавиш змейка натыкается на себя, избавимся от этого (steps = true/false)
  // прописываем условие что след стрелка срабатывает только после хода змейки на экране
  if(steps == true) {
    if(e.keyCode == 37 && direction != 'right') {  // второе условие для предотвращения резких изменений направления
      // console.log('left');
      direction = 'left';
      steps = false;
    }
    else if(e.keyCode == 38 && direction != 'down') {
      // console.log('up');
      direction = 'up';
      steps = false;
    }
    else if(e.keyCode == 39 && direction != 'left') {
      // console.log('right');
      direction = 'right';
      steps = false;
    }
    else if(e.keyCode == 40 && direction != 'up') {
      // console.log('down');
      direction = 'down';
      steps = false;
    }
  }
});
