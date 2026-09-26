const dotenv = require('dotenv');
dotenv.config();

function checkOrigin(req, res, next) {
    const allowedOrigins = [
        process.env.FRONTEND_URL_1,
        process.env.FRONTEND_URL_2,
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
    ].filter(Boolean);

    const origin = req.headers.origin;

    // Allow requests with no origin (like mobile apps, curl, server-to-server) or from allowed origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }

        return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
}

module.exports = checkOrigin;
