const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet'); // For security headers
const app = express();
const cors = require('cors');



// index.js






admin.initializeApp();

app.use((req, res, next) => {
  res.removeHeader('Server');
  next();
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Middleware to generate and attach nonce
const generateNonce = (req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  next();
};

// Middleware for security headers using Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          (req, res) => `'nonce-${res.locals.nonce}'`,
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://*.google.com",
          "https://unpkg.com",
          "https://tile.openstreetmap.org",
          "https://*.tiles.mapbox.com",
          "https://cdnjs.cloudflare.com",
        
        ],
        "style-src": [
          "'self'",
          (req, res) => `'nonce-${res.locals.nonce}'`,
          "https://fonts.googleapis.com",
          "'unsafe-inline'",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://*.google.com",
          "https://tile.openstreetmap.org",
          "https://*.tiles.mapbox.com",
          "https://*.openstreetmap.org",
        ],
        "connect-src": [
          "'self'",
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://*.google.com",
          "https://tile.openstreetmap.org",
          "https://*.tiles.mapbox.com",
          "https://*.openstreetmap.org",
          "https://firestore.googleapis.com",
          "https://*.cloudfunctions.net",
         
        ],
        "frame-src": ["'self'", "https://*.google.com"],
        "worker-src": ["'self'", "blob:"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
      },
    },
  })
);

// Apply nonce generation middleware
app.use(generateNonce);

// Fleet Heartbeat Checker
exports.checkFleetHeartbeat = functions.scheduler.onSchedule(
  { schedule: '* * * * *' },
  async (event) => {
    const threshold = Date.now() - 89990; // 90 seconds threshold
    const fleetsRef = admin.firestore().collection('fleets');

    const fleetsSnapshot = await fleetsRef.get();
    const updatePromises = fleetsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const lastHeartbeat = data.heartbeat ? data.heartbeat.toMillis() : 0;

      if (lastHeartbeat < threshold) {
        await fleetsRef.doc(doc.id).update({ status: 'Inactive' });
        console.log(`Fleet ${doc.id} marked as Inactive.`);
      }
    });

    await Promise.all(updatePromises);
  }
);

// Main route for rendering the HTML
app.get('/', (req, res) => {
  const nonce = res.locals.nonce;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Your Map Application</title>

        <!-- Google Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

        <!-- Leaflet Map Styles -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
              integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
              crossorigin="" />

        <style nonce="${nonce}">
            #map { height: 400px; width: 100%; }
        </style>
    </head>
    <body>
        <div id="root"></div>

        <!-- Google Maps API -->
        <script nonce="${nonce}"
                src="https://maps.googleapis.com/maps/api/js?key=process.env.REACT_APP_GOOGLE_MAPS_API_KEY">
        </script>

        <!-- Your bundled app script -->
        <script src="/client.js" nonce="${nonce}"></script>

        <script nonce="${nonce}">
            window.__INITIAL_STATE__ = ${JSON.stringify({
              // Pass any required initial state here
            })};
        </script>
    </body>
    </html>
  `);
});

//I believe di nagana -xy
const corsOptions = {
  origin: [
    'https://trashtrack-ac6eb.web.app',
    'https://trashtrack-ac6eb.firebaseapp.com',
    // Add your local development URL if needed
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Example updateUser function
app.put('/updateUser', async (req, res) => {
  try {
    // Add your user update logic here
    const { uid, userData } = req.body;
    
    await admin.auth().updateUser(uid, userData);
    // or update in Firestore
    await admin.firestore().collection('users').doc(uid).update(userData);
    
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res, next) => {
  res.removeHeader('Date');
  next();
});

// Export the app as a Firebase HTTPS function
exports.ssrApp = functions.https.onRequest(app);