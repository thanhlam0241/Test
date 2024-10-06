export interface Environment {
  production: boolean;
  apiUrl: string;
}

export const environment: Environment = {
  production: false,
  // apiUrl: '/api',
  apiUrl: 'http://localhost:8000',
};
