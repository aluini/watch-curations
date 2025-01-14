# Watch Curation Builder

A static site generator for curating and showcasing watch collections. This project dynamically generates static HTML pages for each category, with a responsive design and no backend dependencies. 
It is a **Vanilla JavaScript project built for fun**, showcasing how to create a dynamic and responsive website without relying on frameworks or libraries; might evolve for something more complex later.
It is optimized for deployment on platforms like [Netlify](https://www.netlify.com/).

---

## Features

- **Dynamic Category Handling**: Automatically detects categories from JSON files.
- **Static Site Generation**: Pre-generates HTML files for fast loading.
- **Responsive Design**: Fully responsive layout for various screen sizes.
- **Accessible Sidebar**: Sidebar menu is toggleable for smaller screens.
- **Customizable Templates**: Easily update styles and structure in the generator script.
- **No Backend Dependency**: Fully static output that can be hosted on any static server.

---

## Project Structure
```json
/ ├── public/ 
│ ├── assets/ 
│ │ ├── curations/ # JSON files for each category 
│ │ └── categories.json # Auto-generated list of all categories thanks to build.js
│ ├── styles.css # CSS for the site 
│ ├── app.js # Client-side JavaScript 
│ └── index.html # Entry point (optional for dynamic use) 
├── dist/ # Output folder for generated static files 
├── build.js # Static site generator script 
└── README.md # Documentation
```

---

## Setup and Usage

### 1. Install Dependencies

### 2. Directory Setup
- Place your category JSON files in the `public/assets/curations/` directory.
- Each JSON file should have the following structure:
  ```json
  {
    "categoryName": "Category Name",
    "description": "Optional description of the category.",
    "header": {
      "url": "path/to/header/image.jpg",
      "author": {
        "name": "Author Name",
        "url": "Author URL"
      },
      "platform": {
        "name": "Platform Name",
        "url": "Platform URL"
      }
    },
    "curations": [
      {
        "image": "path/to/image.jpg",
        "brand": "Brand Name",
        "product": "Product Name",
        "reference": "Optional Reference",
        "collection": "Optional Collection",
        "links": [
          {
            "label": "Buy Now",
            "url": "https://example.com",
            "target": "_blank"
          }
        ]
      }
    ]
  }
  ```

### 3. Run the Build Script
Use the `build.js` script to generate the static site:
```bash
node build.js
```

This will:
- Generate categories.json from the category JSON files.
- Create static HTML files in the dist/ directory.
- Copy static assets from public/ to dist/.
  
### 4. Deploy
Deploy the dist/ folder to any static hosting service, such as Netlify or Vercel.

## License
This project is open-source and available under the MIT License.
  
