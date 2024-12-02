// const express = require('express');
// const ReactDOMServer = require('react-dom/server');
// const React = require('react');
// const Navbar = require('../src/pages/Navbar.js');  // Adjust the path as necessary
// const generateNonce = require('./generateNonceMiddleware');  // Import the nonce generation middleware

// const app = express();

// // Use the generateNonce middleware for all routes
// app.use(generateNonce);

// app.get("/", (req, res) => {
//   const nonce = res.locals.nonce;  // Access the nonce stored in res.locals

//   // Render the React app to an HTML string with the nonce passed as a prop
//   const reactAppHtml = ReactDOMServer.renderToString(<Navbar nonce={nonce} />);

//   // Send the HTML with the nonce in the Content-Security-Policy header
//   res.send(`
//     <html>
//       <head>
//         <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-${nonce}'">
//       </head>
//       <body>
//         <div id="root">${reactAppHtml}</div>
//       </body>
//     </html>
//   `);
// });

// app.listen(3000, () => console.log('Server running on http://localhost:3000'));