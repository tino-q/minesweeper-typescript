import { Method } from 'axios';

interface Methods {
  [key: string]: Method;
}

export const METHODS: Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};
