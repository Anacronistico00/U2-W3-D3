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
                            <img src="${
                              libro.img
                            }" class="card-img-top" alt="Copertina ${
          libro.title
        }">
                            <div class="card-body d-flex flex-column">
                                <p class="card-title fw-bold">${libro.title}</p>
                                <p class="card-category bg-black text-white rounded-5 w-25 text-center fw-bold">${
                                  libro.category
                                }</p>
                                <p class="card-text fw-bold fs-3 text-center">€ ${libro.price.toFixed(
                                  2
                                )}</p>
                                <button class="btn btn-danger mt-auto btnScarta">Scarta</button>
                            </div>
                        </div>
                    `;

        const btnScarta = cardDiv.querySelector('.btnScarta');
        btnScarta.addEventListener('click', function (e) {
          e.preventDefault();
          cardDiv.remove();
        });

        libreria.appendChild(cardDiv);
      });
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

caricaLibri();
