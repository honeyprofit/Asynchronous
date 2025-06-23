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
    return `You are in ${dataGeo.city}, ${dataGeo.countryName}`;
  } catch (error) {
    console.error(`${error}..😫`);
    renderError(`Render error..🙁 ${error.message}`);

    //Reject promise returned from async function
    throw error;
  }
};

console.log('1:HE IS HERE FIRST');
// const city = whereIsHe();
// console.log(city);

// whereIsHe()
//   .then(city => console.log(`2: ${city}`))
//   .catch(error => console.error(`2: ${error.message}😫!!`))
//   .finally(() => console.log('3: HE IS HERE finally'));

(async function () {
  try {
    const city = await whereIsHe();
    console.log(`2: ${city}`);
  } catch (error) {
    console.error(`2: ${error.message}😫!!`);
  }
  console.log('3: HE IS HERE finally');
})();

//try-catch to handle real error
// try {
//   let y = 1;
//   const x = 2;
//   x = 3;
// } catch (error) {
//   alert(error.message);
//   console.log(error);
// }
