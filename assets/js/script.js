const libreria = document.getElementById('libri-container');

function caricaLibri() {
  fetch('https://striveschool-api.herokuapp.com/books')
    .then((response) => {
      return response.json();
    })
    .then((libri) => {
      libri.forEach((libro) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('col');

        cardDiv.innerHTML = `<div class="card h-100">
                            <img src="${libro.img}" class="cardImg" alt="Copertina ${libro.title}">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <p class="card-title fw-bold">${libro.title}</p>
                                <p class="card-category bg-black text-white rounded-5 w-25 text-center fw-bold">${libro.category}</p>
                                <div>
                                    <p class="card-text fw-bold fs-3 text-center">€ ${libro.price}</p>
                                    <div class="d-flex">
                                        <button class="btn btn-danger mt-auto btnCart w-50 mx-2"><i class="bi bi-cart-plus"></i></button>
                                        <button class="btn btn-danger mt-auto btnScarta w-50 mx-2"><i class="bi bi-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

        const btnScarta = cardDiv.querySelector('.btnScarta');
        btnScarta.addEventListener('click', function (e) {
          e.preventDefault();
          cardDiv.remove();
        });

        const btnCart = cardDiv.querySelector('.btnCart');
        btnCart.addEventListener('click', (e) => {
          e.preventDefault();
          cartLocal.push(libro);
          addToCart();
        });

        libreria.appendChild(cardDiv);
      });
      addToCart();
    })
    .catch((error) => {
      console.log(`Errore nel caricamento della libreria: `, error);
      libreria.innerHTML = `
        <div class="m-auto">
            <div class="alert alert-danger text-center">
                Impossibile caricare i libri. Riprova più tardi.
                <p class="fw-bold">${error.message}</p>
            </div>
        </div>
    `;
    });
}

let cartLocal = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const cartItemsNumber = document.getElementById('cartItemsNumber');
const btnCartClear = document.getElementById('btnCartClear');

btnCartClear.addEventListener('click', (e) => {
  e.preventDefault();
  cartLocal = [];
  localStorage.removeItem('cartItems');
  addToCart();
});

function addToCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartLocal));

  cartList.innerHTML = '';

  let totalPrice = 0;

  cartLocal.forEach((libro, index) => {
    const cartElement = document.createElement('li');
    cartElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-center'
    );
    cartElement.innerHTML = `
<div class="card">
 <div class="row d-flex align-items-center">
  <img src="${libro.img}" class="cartImg col-5" alt="Copertina ${libro.title}" />
  <div class="card-body col-7 d-flex flex-column justify-content-between">
    <p class="card-title">
      ${libro.title} <br />
      €${libro.price}
    </p>
    <button class="btn btn-sm btn-danger btnCartRemove" data-index="${index}">
      <i class="bi bi-trash"></i>
    </button>
  </div>
  </div>
</div>
`;

    cartList.appendChild(cartElement);
    totalPrice += libro.price;
  });

  cartTotal.textContent = totalPrice;
  cartItemsNumber.textContent = cartLocal.length;

  document.querySelectorAll('.btnCartRemove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      cartLocal.splice(index, 1);
      addToCart();
    });
  });
}

caricaLibri();
