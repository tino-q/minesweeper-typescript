import schemas from './schemas';
import paths from './paths';

export default {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Minesweeper',
    description: 'Minesweeper'
  },
  servers: [{ url: '/', description: 'Local Dev' }],
  paths,
  components: {
    schemas,
    securitySchemes: {}
  }
};
