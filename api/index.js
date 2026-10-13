// Vercel serverless entrypoint — all non-static requests are rewritten here
// (see vercel.json). The Express app handles routing exactly as on Render.
module.exports = require('../app');
