import 'module-alias/register';
import express from 'express';

import { expressLoader, swaggerLoader } from '~loaders';

const app = express();

swaggerLoader(app);
expressLoader(app);

export default app;
