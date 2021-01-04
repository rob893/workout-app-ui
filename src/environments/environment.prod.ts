import { Environment } from 'src/app/models/core';
import { commonEnvironment } from './environment.common';

export const environment: Environment = {
  ...commonEnvironment,
  production: true,
  env: 'production',
  workoutAppBaseUrl: 'https://localhost:5001/api'
};
