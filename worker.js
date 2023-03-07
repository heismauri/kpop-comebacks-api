import { Router } from 'itty-router';

import buildHTML from './routes/index';
import { handleRequest } from './routes/api';
import notFound from './routes/404';

const router = Router();

router.get('/', async () => buildHTML());

router.get('/api', async () => handleRequest());

router.all('*', async () => notFound());

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request));
});
