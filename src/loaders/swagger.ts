import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '~docs';
import config from '~config';
import { ENVIRONMENTS } from '~constants';

export function swaggerLoader(app: Application): Application {
  if (config.environment !== ENVIRONMENTS.PRODUCTION) {
    app.use(
      '/swagger',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }
  return app;
}
