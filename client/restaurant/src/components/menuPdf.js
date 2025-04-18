import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const generateMenuPDF = async (menuItems) => {

  const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #f8f9fa, #e0f7fa);
          padding: 40px;
        }
        h1 {
          text-align: center;
          color: #ff5722;
          font-size: 36px;
          margin-bottom: 50px;
        }
        .menu-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px 40px;
          justify-items: center;
        }
        .menu-card {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 15px;
          margin-bottom: 30px;
          width: 100%;
          max-width: 200px;
          transition: transform 0.3s ease;
        }
        .menu-card:hover {
          transform: translateY(-5px);
        }
        .menu-card img {
          width: 100%;
          height: 130px;
          border-radius: 10px;
          object-fit: cover;
          margin-bottom: 10px;
        }
        .menu-card h3 {
          font-size: 20px;
          color: #2c3e50;
          margin: 10px 0;
        }
        .menu-card p {
          font-size: 14px;
          color: #607d8b;
          margin: 4px 0;
        }
        .menu-card .label {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 12px;
          background-color: #ffccbc;
          color: #bf360c;
          font-size: 12px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <h1>Restaurant Menu</h1>
      <div class="menu-container">
        ${menuItems
          .map(
            (item) => `
            <div class="menu-card">
              ${
                item.image
                  ? `<img src="${item.image}" alt="${item.name}" />`
                  : `<img src="https://via.placeholder.com/280x180.png?text=No+Image" alt="No image" />`
              }
              <h3>${item.name} - ₹${item.price}</h3>
              <p><strong>Type:</strong> ${item.type}</p>
              <p><strong>Category:</strong> ${item.category}</p>
              <div class="label">${item.type.toUpperCase()}</div>
            </div>
          `
          )
          .join("")}
      </div>
    </body>
  </html>
  `;

  // Generate PDF and get URI
  const { uri } = await Print.printToFileAsync({ html: htmlContent });

  // Share the PDF (or use FileSystem to save it if needed)
  await Sharing.shareAsync(uri);
};
