'use strict';

const cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  loginForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  userName = document.querySelector('.user-name'),
  buttunOut = document.querySelector('.button-out'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

const getData = async function(url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу^ ${url}, 
    статус ошибки: ${response.status}!`);
  }

  return await response.json();

};

console.log(getData('./db/partners.json'));

const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  if(!nameReg.test(str)) {
    if(str.length < 20) console.log('Довгий логін');
  }

  return true;
}

const toggleModal = function() {
  modal.classList.toggle("is-open");
}

const toggleModalAuth = function() {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle('is-open');
}

buttonAuth.addEventListener('click', toggleModalAuth);
closeAuth.addEventListener('click', toggleModalAuth);

function autorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttunOut.style.display = '';
    buttunOut.removeEventListener('click', logOut);
    checkAuth();
  }

  console.log('Авторизован');

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttunOut.style.display = 'block';
  buttunOut.addEventListener('click', logOut);
}

function notAutorized() {
  console.log('Не Авторизован');

  function logIn(event) {
    event.preventDefault();

    if (valid(loginInput.value.trim())) {

      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'tomato';
      loginInput.value = '';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}

checkAuth();

function createCardRestaraunts({ image, name, stars, price, kitchen, 
  products, time_of_delivery: timeOfDelivery }) {

  const card = `
    <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood({ id, name, description, price, image }) {
  const card = document.createElement('div');
  
    card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src = "${image}" alt = "image" class = "card-image" / >
      <div class = "card-text" >
        <div class = "card-heading">
          <h3 class = "card-title card-title-reg">${name}</h3> 
        </div> 
        <div class = "card-info">
          <div class = "ingredients"> 
            ${description}. 
          </div> 
        </div> 
        <div class = "card-buttons">
          <button class = "button button-primary button-add-cart">
            <span class = "button-card-text"> В корзину </span> 
            <span class = "button-cart-svg"> </span> 
          </button> 
          <strong class="card-price-bold">${price} ₽</strong> 
        </div> 
      </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;
  if (login) {
    const restaurant = target.closest('.card-restaurant');

    if(restaurant) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        console.log(data);
        data.forEach(createCardGood);
      });
    } else {
      toggleModalAuth();
      }

  }

}

function init() {
  getData('./db/partners.json').then(function (data) {
    console.log(data);
    data.forEach(createCardRestaraunts);
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  const mySwiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000,
    },
    sliderPerView: 1,
    slidesPerColumn: 1,
  });
}

init();