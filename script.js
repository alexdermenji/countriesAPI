'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className}">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)} people</p> 
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
</article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getCountryData = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders;
      if (!neighbour) return;
      for (let i = 0; i < neighbour.length; i++) {
        fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour[i]}`)
          .then(response => response.json())
          .then(data => renderCountry(data, 'neighbour'));
      }
    })
    .catch(err => renderError(`Something is wrong ${err.message}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('germany');
});
