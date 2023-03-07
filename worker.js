import { Router } from 'itty-router';

import buildHTML from './routes/root';
import { handleRequest } from './routes/api';

const router = Router();

router.get('/', async () => buildHTML());

router.get('/api', async () => handleRequest());

router.all('*', () => new Response('Not Found.', { status: 404 }));

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request));
});
