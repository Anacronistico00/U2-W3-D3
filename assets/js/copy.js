document.addEventListener('DOMContentLoaded', () => {
  const libreria = document.getElementById('libri-container');
  const carrelloLista = document.getElementById('carrello-lista');
  const totaleCarrelloSpan = document.getElementById('totale-carrello');
  const conteggioCarrello = document.getElementById('conteggio-carrello');

  // Gestione Carrello con LocalStorage
  let carrello = JSON.parse(localStorage.getItem('carrello')) || [];

  function aggiornaCarrello() {
    // Salva il carrello in localStorage
    localStorage.setItem('carrello', JSON.stringify(carrello));

    // Svuota la lista del carrello
    carrelloLista.innerHTML = '';

    // Calcolo totale
    let totale = 0;

    // Ricostruisce il carrello
    carrello.forEach((libro, index) => {
      const elementoCarrello = document.createElement('li');
      elementoCarrello.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-center'
      );

      elementoCarrello.innerHTML = `
              ${libro.title} - €${libro.price.toFixed(2)}
              <button class="btn btn-sm btn-danger btn-rimuovi-carrello" data-index="${index}">
                  X
              </button>
          `;

      carrelloLista.appendChild(elementoCarrello);
      totale += libro.price;
    });

    // Aggiorna totale e conteggio
    totaleCarrelloSpan.textContent = totale.toFixed(2);
    conteggioCarrello.textContent = carrello.length;

    // Aggiungi event listener per rimozione
    document.querySelectorAll('.btn-rimuovi-carrello').forEach((button) => {
      button.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        carrello.splice(index, 1);
        aggiornaCarrello();
      });
    });
  }

  function caricaLibri() {
    fetch('https://striveschool-api.herokuapp.com/books')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Errore nella risposta del server');
        }
        return response.json();
      })
      .then((libri) => {
        libri.forEach((libro) => {
          const cardColonna = document.createElement('div');
          cardColonna.classList.add('col');

          cardColonna.innerHTML = `
                      <div class="card h-100">
                          <img src="${
                            libro.img
                          }" class="card-img-top" alt="Copertina ${
            libro.title
          }">
                          <div class="card-body d-flex flex-column">
                              <h5 class="card-title">${libro.title}</h5>
                              <p class="card-text">€ ${libro.price.toFixed(
                                2
                              )}</p>
                              <div class="mt-auto d-flex justify-content-between">
                                  <button class="btn btn-danger btn-scarta">Scarta</button>
                                  <button class="btn btn-success btn-aggiungi-carrello">+ Carrello</button>
                              </div>
                          </div>
                      </div>
                  `;

          // Bottone Scarta
          const btnScarta = cardColonna.querySelector('.btn-scarta');
          btnScarta.addEventListener('click', () => {
            cardColonna.remove();
          });

          // Bottone Aggiungi al Carrello
          const btnAggiungiCarrello = cardColonna.querySelector(
            '.btn-aggiungi-carrello'
          );
          btnAggiungiCarrello.addEventListener('click', () => {
            // Controllo per evitare duplicati
            const libroDuplicato = carrello.find(
              (item) => item.title === libro.title
            );
            if (!libroDuplicato) {
              carrello.push(libro);
              aggiornaCarrello();
            } else {
              alert('Questo libro è già nel carrello!');
            }
          });

          libreria.appendChild(cardColonna);
        });

        // Inizializza il carrello al caricamento
        aggiornaCarrello();
      })
      .catch((errore) => {
        console.error('Errore nel caricamento dei libri:', errore);
        libreria.innerHTML = `
                  <div class="col-12">
                      <div class="alert alert-danger">
                          Impossibile caricare i libri. Riprova più tardi.
                          <p>${errore.message}</p>
                      </div>
                  </div>
              `;
      });
  }

  caricaLibri();
});
