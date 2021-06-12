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
    ).toFixed(1)} million people</p> 
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
</article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getJSON = function (url, errMsg = 'Something is wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(errMsg);
    }
    return response.json();
  });
};

const getCountryData = function (country) {
  getJSON(
    `https://restcountries.eu/rest/v2/name/${country}`,
    'Country was not found'
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders;

      if (!neighbour) throw new Error('No neighbours found');
      for (let i = 0; i < neighbour.length; i++) {
        getJSON(
          `https://restcountries.eu/rest/v2/alpha/${neighbour[i]}`,
          'neighbour country was not found'
        ).then(data => renderCountry(data, 'neighbour'));
      }
    })
    .catch(err => renderError(`Something is wrong ${err.message}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      err => reject(err)
    );
  });
};

const whereAmI = function () {
  countriesContainer.innerHTML = '';
  getPosition()
    .then(pos => {
      console.log(pos);
      const { latitude: lat, longitude: lng } = pos.coords;
      console.log(lat, lng);
      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(data => {
      if (data.error) {
        throw new Error(data.error.message);
      }
      console.log(`You are in ${data.city}, ${data.country}`);
      getCountryData(data.country);
    })
    .catch(err => {
      renderError(err.message);
      console.error(err.message);
    });
};

btn.addEventListener('click', whereAmI);
