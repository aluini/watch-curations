const categoriesEl = document.getElementById('categories');
const curationsEl = document.getElementById('curations');
const curationTitle = document.getElementById('curationTitle');
const curationDescription = document.getElementById('curationDescription');
const curationHeader = document.getElementById('curationHeader');
let currentCategoryId = null;

async function loadCategories() {
  try {
    const response = await fetch('/assets/categories.json');
    if (!response.ok) throw new Error('Failed to fetch categories');
    const categories = await response.json();

    const initialCategory = window.location.pathname.split('/').filter(Boolean)[0] || categories[0].id;
    currentCategoryId = initialCategory;

    renderCategories(categories, currentCategoryId);
    handleCategoryClick(initialCategory);
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadCategory(categoryId) {
  try {
    const response = await fetch(`assets/curations/${categoryId}.json`);
    if (!response.ok) throw new Error('Category not found');
    const categoryData = await response.json();
    renderCategory(categoryData);
  } catch (error) {
    console.error('Error loading category:', error);
    curationsEl.innerHTML = `<p>Category not found</p>`;
  }
}

function renderCategories(categories, currentCategoryId) {
  console.log('renderCategories',categories)
  categoriesEl.innerHTML = '';
  categories.forEach(({ id, name }) => {
    const li = document.createElement('li');
    li.className = id === currentCategoryId ? 'active' : '';
    const a = document.createElement('a');
    a.href = `/${id}`;
    a.textContent = name;
    a.addEventListener('click', (event) => {
      event.preventDefault();
      handleCategoryClick(id);
    });

    li.appendChild(a);
    categoriesEl.appendChild(li);
  });
}

function renderCategory(categoryData) {
  const { name, description, header, curations } = categoryData;
  document.title = name + ' | Watch curations';
  curationTitle.innerHTML = name;
  curationDescription.innerHTML = '';
  curationDescription.hidden = true;
  curationHeader.innerHTML = '';
  curationHeader.hidden = true;
  if (header) {
    curationHeader.innerHTML = '<img src="'+header.url+'" alt="Illustration about '+name+'" />';
    curationHeader.hidden = false;
    if (header.author || header.platform) {
      const figcaptionEl = document.createElement('figcaption');
      figcaptionEl.innerHTML = 'Photo'+(header.author ? ' by <a href="'+header.author.url+'">'+header.author.name+'</a>' : '')+(header.platform ? ' on <a href="'+header.platform.url+'">'+header.platform.name+'</a>' : '');
      curationHeader.appendChild(figcaptionEl)
    }
  }
  if (description) {
    curationDescription.innerHTML = description;
    curationDescription.hidden = false;
  }
  curationsEl.innerHTML = '';
  curations.sort((a, b) => a.brand.localeCompare(b.brand))
  curations.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'curation-item';
    div.innerHTML = `<div class="product">
      <div class="img"><img src="${item.image}" alt="${item.product}"></div>
      <div class="productInfo"><h3 class="brand">${item.brand}</h3>
      <h2>${item.collection ? `<small class="collection">${item.collection}</small> ` : ''}${item.product}</h2>
      ${item.reference ? `<p>${item.reference}</p>` : ''}
    </div></div>`;

    if (item.links && item.links.length > 0) {
      const linksDiv = document.createElement('div');
      linksDiv.className = 'links';
      item.links.forEach((link) => {
        const linkEl = document.createElement('a');
        linkEl.href = link.url;
        if(link.target)
          linkEl.target = link.target;
        linkEl.textContent = link.label;
        linksDiv.appendChild(linkEl);
      });
      div.appendChild(linksDiv);
    }

    curationsEl.appendChild(div);
  });
}


function updateURL(categoryId) {
  const newURL = `${window.location.origin}/${categoryId}`;
  window.history.pushState({ categoryId }, '', newURL);
}

function handleCategoryClick(categoryId) {
  currentCategoryId = categoryId; // Set currentCategoryId
  updateURL(categoryId);
  loadCategory(categoryId);

  // Re-render categories to update the active state
  fetch('/assets/categories.json')
    .then((response) => response.json())
    .then((categories) => renderCategories(categories, currentCategoryId))
    .catch((error) => console.error('Error fetching categories:', error));
}

// Handle back/forward navigation
window.addEventListener('popstate', (event) => {
  const categoryId = event.state?.categoryId || currentCategoryId || 'default-category';
  currentCategoryId = categoryId; // Update currentCategoryId
  loadCategory(categoryId);

  // Re-render categories with the updated currentCategoryId
  fetch('/assets/categories.json')
    .then((response) => response.json())
    .then((categories) => renderCategories(categories, currentCategoryId))
    .catch((error) => console.error('Error fetching categories:', error));
});

// Initialize the app
loadCategories();