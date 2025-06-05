'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `        
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}M people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereIsHe = async function (country) {
  try {
    // Geo location
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    if (!resGeo.ok) throw new Error(`Problem getting location data`);

    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    //   Country data
    //   fetch(`https://restcountries.com/v2/name/${country}`).then(res =>
    //     console.log(res)
    //   );

    const res = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.countryCode}`
    );
    if (!res.ok) throw new Error(`Problem getting country code`);

    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);
  } catch (error) {
    console.error(`${error}..😫`);
    renderError(`Render error..🙁 ${error.message}`);
  }
};

whereIsHe();
console.log('HE IS HERE FIRST');

//try-catch to handle real error
// try {
//   let y = 1;
//   const x = 2;
//   x = 3;
// } catch (error) {
//   alert(error.message);
//   console.log(error);
// }
