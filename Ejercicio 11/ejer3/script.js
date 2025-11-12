document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const categorySelect = document.getElementById("filter-category");
  const brandSelect = document.getElementById("filter-brand");
  const sortSelect = document.getElementById("sort-price");
  const messageBox = document.getElementById("message");

  let products = [];
  let filteredProducts = [];

  const showMessage = (text, type = "danger") => {
    messageBox.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
  };

  fetch("products.json")
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar los productos");
      return response.json();
    })
    .then(data => {
      products = data;
      filteredProducts = [...products];
      renderProducts(products);
      loadFilters(products);
    })
    .catch(error => {
      showMessage("No se pudieron cargar los productos. Intenta nuevamente más tarde.");
      console.error(error);
    });

  function loadFilters(data) {
    const categories = [...new Set(data.map(p => p.category))];
    const brands = [...new Set(data.map(p => p.brand))];

    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });

    brands.forEach(brand => {
      const opt = document.createElement("option");
      opt.value = brand;
      opt.textContent = brand;
      brandSelect.appendChild(opt);
    });
  }

  function renderProducts(list) {
    productList.innerHTML = "";

    if (list.length === 0) {
      productList.innerHTML = `<div class="text-center text-muted py-4">No se encontraron productos.</div>`;
      return;
    }

    list.forEach(prod => {
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${prod.imageUrl}" class="card-img-top" alt="${prod.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${prod.name}</h5>
            <p class="card-text small text-muted">${prod.category} - ${prod.brand}</p>
            <p class="card-text">${prod.description}</p>
            <p class="fw-bold text-success mt-auto">€${prod.price.toFixed(2)}</p>
          </div>
        </div>
      `;
      productList.appendChild(card);
    });
  }

  function updateCatalog() {
    const category = categorySelect.value;
    const brand = brandSelect.value;
    const sort = sortSelect.value;

    filteredProducts = products.filter(p => {
      return (
        (category === "" || p.category === category) &&
        (brand === "" || p.brand === brand)
      );
    });

    if (sort === "asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(filteredProducts);
  }

  categorySelect.addEventListener("change", updateCatalog);
  brandSelect.addEventListener("change", updateCatalog);
  sortSelect.addEventListener("change", updateCatalog);
});
