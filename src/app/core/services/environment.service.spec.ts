import { Environment, LogLevel } from '../models/core';
import { EnvironmentService } from './environment.service';

function getEnvMock(env?: Partial<Environment>): Environment {
  return {
    production: false,
    logLevel: LogLevel.Debug,
    clientSideLoggingEnabled: true,
    env: 'development',
    localStoragePrefix: 'test-prefix',
    workoutAppBaseUrl: 'https://testurl.com',
    allowedHosts: ['https://testurl.com'],
    googleAuthClientId: '123',
    anonymousUrls: [],
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
