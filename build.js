const fs = require('fs');
const path = require('path');

// Paths
const curationsDir = path.join(__dirname, 'public', 'assets', 'curations');
const categoriesDir = path.join(__dirname, 'public', 'assets');
const outputDir = path.join(__dirname, 'dist');

// Function to build the categories.json file
function buildCategories() {
  try {
    const files = fs.readdirSync(curationsDir);
    const categories = [];

    files.forEach((file) => {
      if (file.endsWith('.json')) {
        const filePath = path.join(curationsDir, file);
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Extract category name and ID (file name without .json)
        const categoryId = path.basename(file, '.json');
        const categoryName = jsonData.name;
        const categoryEmoji = jsonData.emoji;

        if (categoryName) {
          categories.push({ id: categoryId, name: categoryEmoji + ' ' + categoryName });
        }
      }
    });

    // Write the aggregated data to categories.json
    const outputFile = path.join(categoriesDir, 'categories.json');
    fs.writeFileSync(outputFile, JSON.stringify(categories, null, 2));
    console.log('Successfully built categories.json');

    // Return the categories array for further use
    return categories;
  } catch (error) {
    console.error('Error building categories:', error);
    return []; // Return an empty array on error to avoid breaking subsequent steps
  }
}

// Template for HTML files
function generateHTML(categoryData, categoriesData, categoryId) {
  const { name, description, header, curations } = categoryData;
  const curationsHTML = curations
    .sort((a, b) => a.brand.localeCompare(b.brand))
    .map(
      (item) => `
      <div class="curation-item">
        <div class="product">
          <div class="img">
            <img src="${item.image}" alt="${item.product}">
          </div>
          <div class="productInfo">
            <h3 class="brand">${item.brand}</h3>
            <h2>${item.collection ? `<small class="collection">${item.collection}</small> ` : ''}${item.product}</h2>
            ${item.reference ? `<p>${item.reference}</p>` : ''}
          </div>
        </div>
        ${
          item.links && item.links.length > 0
            ? `<div class="links">
              ${item.links
                .map(
                  (link) =>
                    `<a href="${link.url}" target="${link.target || '_self'}">${link.label}</a>`
                )
                .join('')}
            </div>`
            : ''
        }
      </div>
    `
    )
    .join('');

  const categoriesHTML = categoriesData
    .map(
      (item) =>
        `<li class="${categoryId === item.id ? 'active' : ''}"><a href="/${item.id}">${item.name}</a></li>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Watch Curations</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap" rel="stylesheet">
</head>
<body>
  <div id="app">
    <input type="checkbox" id="sidebarToggle" hidden>
    <label for="sidebarToggle" id="sidebarButton" aria-expanded="false" aria-controls="sidebar">
      ☰ Menu
    </label>
    <aside id="sidebar">
      <div>
        <h3>Watch curations</h3>
        <ul id="categories">
          ${categoriesHTML}
        </ul>
      </div>
    </aside>
    <main id="main">
      ${
        header
          ? `<figure id="curationHeader">
              ${header.url ? `<img src="${header.url}" alt="Illustration about ${name}'" />` : ''}
              ${
                header.author || header.platform
                  ? `<figcaption>Photo${
                      header.author ? ` by <a href="${header.author.url}">${header.author.name}</a>` : ''
                    }${header.platform ? ` on <a href="${header.platform.url}">${header.platform.name}</a>` : ''}</figcaption>`
                  : ''
              }
            </figure>`
          : ''
      }
      <header>
        <h1 id="curationTitle">${name}</h1>
        ${description ? `<div id="curationDescription">${description}</div>` : ''}
      </header>  
      <div id="curations">${curationsHTML}</div>
      <footer>2025 - Images and names are property of their respective owners.</footer>
    </main>
  </div>
  <script src="/app.js"></script>
</body>
</html>
  `;
}

// Build function
function build() {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Ensure categories.json is built and get its data
    const categoriesData = buildCategories();

    // Read all JSON files in curationsDir
    const files = fs.readdirSync(curationsDir);
    files.forEach((file) => {
      if (file.endsWith('.json')) {
        const filePath = path.join(curationsDir, file);
        const categoryData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Generate HTML for the category
        const categoryId = path.basename(file, '.json');
        const html = generateHTML(categoryData, categoriesData, categoryId);

        // Write the HTML file
        const outputFilePath = path.join(outputDir, `${categoryId}.html`);
        fs.writeFileSync(outputFilePath, html, 'utf8');
        console.log(`Generated: ${outputFilePath}`);
      }
    });

    // Copy static files (e.g., CSS, JS, and assets)
    fs.cpSync(path.join(__dirname, 'public'), outputDir, { recursive: true });
    console.log('Static files copied.');
  } catch (error) {
    console.error('Error during build:', error);
  }
}

// Run the build
build();