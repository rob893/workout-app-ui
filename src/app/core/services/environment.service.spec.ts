import { Environment } from '../models/core';
import { EnvironmentService } from './environment.service';

function getEnvMock(env?: Partial<Environment>): Environment {
  return {
    production: false,
    env: 'development',
    localStoragePrefix: 'test-prefix',
    ...env
  };
}

describe('EnvironmentService', () => {
  describe('production', () => {
    const tests = [true, false];

    tests.forEach(test => {
      it(`should be ${test}`, () => {
        const service = new EnvironmentService(getEnvMock({ production: test }));

        expect(service.production).toBe(test);
      });
    });
  });
});
