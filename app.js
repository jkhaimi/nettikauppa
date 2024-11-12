//Tämä on näkyvien tuotteiden määrä per sivu. Tässä tehtävässä haluamme 50 tuotetta per sivu.
const productsPerPage = 50;
let currentPage = 0;

//Tässä on valitun yritysten products.json linkit, joista sivun tuotteet otetaan.
const urls = [
    'https://www.poketo.com/products.json',
    'https://www.poketo.com/products.json?limit=50&page=2',
    'https://www.poketo.com/products.json?limit=50&page=3',
    'https://www.poketo.com/products.json?limit=50&page=4',
    'https://www.poketo.com/products.json?limit=50&page=5',
  ];
  
  //Tämä osa koodia ottaa vastaan yllä olevan listan linkeistä ja laittaa ne näkyville sivulle. 
  Promise.all(urls.map(url =>
    fetch(url).then(response => response.json())
  ))
  .then(dataArray => {
    let products = [];
    dataArray.forEach(data => {
      products = products.concat(data.products);
    });

    let container = document.getElementById('products');

    // Tämä silmukka laittaa ensimmäiset tuotteet näkyville kun sivu avataan.
for (let i = 0; i < productsPerPage && i < products.length; i++) {
    const product = products[i];
    let productDiv = document.createElement('div');
    productDiv.classList.add('product');
    
    
    // Tämä if lause pitää huolen siitä, että koodi ei keskeydy kun vastaan tulee tuote jolla ei ole kuvaa.
    if(product.images[0] != undefined) {        
      productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>Price: ${product.variants[0].price} &euro; </p>
        <img src="${product.images[0].src}">
      `;
    } 
    else {
      productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>Price: ${product.variants[0].price} &euro; </p>
      `;
    }
    container.appendChild(productDiv);
  }

//Tämä funktio päivittää sivun kun siirrytään aikaisemmalle tai seuraavalle sivulle.
function updatePage() {

    container.innerHTML = '';
    for (let i = currentPage * productsPerPage; i < (currentPage + 1) * productsPerPage && i < products.length; i++) {
      const product = products[i];
      let productDiv = document.createElement('div');
      productDiv.classList.add('product');

      // Tämä if lause pitää huolen siitä, että koodi ei keskeydy kun vastaan tulee tuote jolla ei ole kuvaa.
      if(product.images[0] != undefined) {        
        productDiv.innerHTML = `
          <h2>${product.title}</h2>
          <p>Price: ${product.variants[0].price} &euro; </p>
          <img src="${product.images[0].src}">
        `;
      } 
      else {
        productDiv.innerHTML = `
          <h2>${product.title}</h2>
          <p>Price: ${product.variants[0].price} &euro; </p>
        `;
      }

      let sortOption = document.getElementById("sort").value;
      if (sortOption === "ascending") {
        products.sort((a, b) => a.variants[0].price - b.variants[0].price);
      } else if (sortOption === "descending") {
        products.sort((a, b) => b.variants[0].price - a.variants[0].price);
      } else if (sortOption === "null") {
        //Korjaa
      }


      container.appendChild(productDiv);
      container.appendChild(previousButton);
      container.appendChild(nextButton);
    }
    
    window.scrollTo(0, 0);
    document.getElementById('currentPage').textContent = `Page ${currentPage + 1}`;

    //Luodaan if lauseet jotka piilottavat "Previous" ja "Next" napit jos kyseessä on ensimmäinen tai viimeinen sivu.
    if (currentPage === 0) {
        previousButton.style.display = 'none';
      } else {
        previousButton.style.display = 'block';
      }
      
      if (currentPage === 4) {
        nextButton.style.display = 'none';
      } else {
        nextButton.style.display = 'block';
      }
  }

  //Luodaan nappi joka vie aikaisemmalle sivulle
  let previousButton = document.createElement('button');
  previousButton.textContent = 'Previous';
  previousButton.className = "previousButton";
  previousButton.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      updatePage();
    }
  });
  container.appendChild(previousButton);
  
  //Luodaan nappi joka vie seuraavalle sivulle
  let nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.className = 'nextButton';
  nextButton.addEventListener('click', () => {
    if ((currentPage + 1) * productsPerPage < products.length) {
      currentPage++;
      updatePage();
    }
  });
  container.appendChild(nextButton);

//Luodaan rivi nappeja joista voi valita sivun
for (let i = 0; i < urls.length; i++) {
  let pageButton = document.createElement('button');
  pageButton.textContent = i + 1;
  pageButton.className = 'pageButton';
  pageButton.addEventListener('click', () => {
    currentPage = i;
    updatePage();
  });
  document.getElementById('pageButtons').appendChild(pageButton);
}
    
//Luodaan if lause joka piilottaa previous napin kun sivu avataan aluksi
if (currentPage === 0) {
  previousButton.style.display = 'none';
} else {
  previousButton.style.display = 'block';
}

document.getElementById('currentPage').textContent = `Page ${currentPage + 1}`;
  })
  .catch(error => console.error(error));