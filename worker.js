import { Router } from 'itty-router';

import buildHTML from './routes/index';
import { handleRequest } from './routes/api';
import notFound from './routes/404';

const router = Router();

router.get('/', async (_, env) => buildHTML(env));

router.get('/api', async (_, env) => handleRequest(env));

router.all('*', async () => notFound());

export default {
  fetch(request, env) {
    return router.handle(request, env);
  }
};
