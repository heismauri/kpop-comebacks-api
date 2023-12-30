import { Router } from 'itty-router';

import buildHTML from './routes/index';
import { handleRequest } from './routes/api';
import notFound from './routes/404';

import styleCSS from './public/style.css';
import mainJS from './public/main.js.txt';

const router = Router();

// Routes
router.get('/', async (_, env) => buildHTML(env));
router.get('/api', async (_, env) => handleRequest(env));

// Static assets
router.get('/style.css', async () => new Response(styleCSS, { headers: { 'Content-Type': 'text/css' } }));
router.get('/main.js', async () => new Response(mainJS, { headers: { 'Content-Type': 'text/javascript' } }));

// 404
router.all('*', async () => notFound());

export default {
  fetch(request, env) {
    return router.handle(request, env);
  }
};
