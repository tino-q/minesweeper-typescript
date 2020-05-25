import schemas from './schemas';
import paths from './paths';

export default {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Minesweeper',
    description: 'Backend API built with typescript express and jest to play the well known Minesweeper game'
  },
  servers: [{ url: 'https://msfttt-env.eba-32y2i3df.us-east-1.elasticbeanstalk.com/', description: 'Development' }],
  paths,
  components: {
    schemas,
    securitySchemes: {}
  }
};