// элементы в DOM можно получить при помощи функции querySelector
const minWeight = document.querySelector('.minweight__input'); // поле ввода мин. значения для сортировки
const maxWeight = document.querySelector('.maxweight__input'); // поле ввода макс. значения для сортировки
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// Массив приоритета цветов
const colorPriority = ['Черный','Светло-красный','Розово-красный','Красный','Темно-красный','Красно-фиолетовый','Красно-сиреневый','Красно-коричневый','Красно-оранжевый',
'Светло-оранжевый','Оранжевый','Оранжево-желтый','Оранжево-коричневый','Оранжево-красный','Оранжево-розовый','Темно-оранжевый',
'Светло-желтый','Желтый','Желто-зеленый','Желто-оранжевый','Желто-розовый','Желто-серый','Темно-желтый',
'Светло-зеленый','Зеленый','Зелено-бежевый','Зелено-желтый','Зелено-коричневый','Зелено-серый','Зелено-синий','Темно-зеленый',
'Светло-голубой','Голубой','Темно-голубой',
'Светло-синий','Синий','Сине-зеленый','Сине-лиловый','Сине-сиреневый','Синевато-белый','Синевато-серый','Синевато-черный','Темно-синий',
'Светло-фиолетовый','Фиолетовый','Фиолетово-синий','Фиолетово-сизый','Фиолетово-черный','Фиолетово-красный','Темно-фиолетовый',
'Белый',
'Светло-коричневый','Коричневый','Темно-коричневый',
'Светло-серый','Серый','Темно-серый']; 


// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);


/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.replaceChildren();
  // Очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits

  for (let i = 0; i < fruits.length; i++) {    
    //fruits[i].index !==undefined? fruits[i].index:fruits[i].index=i;
    let newLi=document.createElement('li'); 
    //newLi.className='fruit__item fruit_violet';
    newLi.innerHTML=`<div class="fruit__info">
        <div>index: ${i} </div>
        <div>kind: ${fruits[i].kind}</div>
        <div>color: ${fruits[i].color}</div>
        <div>weight (кг): ${fruits[i].weight}</div>
      </div>`;
    fruitsList.appendChild(newLi);
    // Формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
  } 
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let indexEl=0;
  let compareArr=[];
  for (let i = 0; i < fruits.length; i++) {
    compareArr.push(fruits[i]);
};
  while (fruits.length > 0) {    
    //  Функция перемешивания массива   
    indexEl=getRandomInt(0,fruits.length-1);     
    result.push(fruits[indexEl]);
    fruits.splice(indexEl,1);  
  }  
  fruits = result; 
  //Проверка нового массива на идентичность предыдущему и вывод предупреждения
  JSON.stringify(compareArr)===JSON.stringify(fruits)? alert ('Перемешивание карточек не изменило порядок'):console.log('not Equal'); 
};
shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => { 
 fruits = JSON.parse(fruitsJSON); 
 const min = minWeight.value || 0;
 const max = maxWeight.value || 100; 
 console.log(min,max);
 const filtered = fruits.filter(item => item.weight>=min && item.weight<=max);
 fruits = filtered;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки


const comparationColor = (a, b, isBig=true) => {
   //Функция сравнения двух элементов по цвету
  const priority = colorPriority.map(element => element.toLowerCase());  
  const priority1 = priority.indexOf(a.color);
  const priority2 = priority.indexOf(b.color);
  return isBig? priority1 > priority2 : priority1 < priority2;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // Функция сортировки пузырьком
    const n = arr.length;
    // внешняя итерация по элементам
    for (let i = 0; i < n-1; i++) { 
        // внутренняя итерация для перестановки элемента в конец массива
        for (let j = 0; j < n-1-i; j++) { 
            // сравниваем элементы
            if (comparation(arr[j], arr[j+1])) { 
                // делаем обмен элементов
                let temp = arr[j+1]; 
                arr[j+1] = arr[j]; 
                arr[j] = temp; 
            }
        }
    }                    
  },

  quickSort(arr, comparation) {    
    // Функция быстрой сортировки 
    quickSortMain(arr,0,arr.length-1);      
    // функция обмена элементов
    function swap(items, firstIndex, secondIndex){  
      const temp = items[firstIndex];
      items[firstIndex] = items[secondIndex];
      items[secondIndex] = temp;
    }
    // функция разделитель
    function partition(items, left, right) {
      let pivot = items[Math.floor((right + left) / 2)],
          i = left,
          j = right;
      while (i <= j) {
          while (comparation(items[i],pivot,false)) {
              i++;
          }
          while (comparation(items[j],pivot)) {
              j--;
          }
          if (i <= j) {
              swap(items, i, j);
              i++;
              j--;
          }
      }
      return i;
    }
    function quickSortMain(items, left, right) {
      let index;
      if (items.length > 1) {
          left = typeof left != "number" ? 0 : left;
          right = typeof right != "number" ? items.length - 1 : right;
          index = partition(items, left, right);
          if (left < index - 1) {
              quickSortMain(items, left, index - 1);
          }
          if (index < right) {
              quickSortMain(items, index, right);
          }
      }
      return items;
    } 
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {    
    const start = new Date().getTime();
    sort(arr, comparation);     
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;    
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // Выбор сортировки между 'bubbleSort' / 'quickSort'
  sortKind === 'quickSort' ? sortKind='bubbleSort':sortKind='quickSort';
  sortKindLabel.textContent = sortKind;

});

sortActionButton.addEventListener('click', () => {  
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  sortTimeLabel.textContent = sortTime;   
  display();  
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  quickSort2(fruits,0,fruits.length-1);
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  display();
});
