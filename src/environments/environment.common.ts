export const commonEnvironment = {
  localStoragePrefix: 'workout-app',
  allowedHosts: ['https://localhost:5001', 'https://rwherber.com'],
  anonymousUrls: [/api\/auth/],
  googleAuthClientId: '724056943218-o5ikb5nqhh58iaq3rilv5b1lgus01ak8.apps.googleusercontent.com',
  retryOptions: {
    enabled: true,
    maxRetryAttempts: 3,
    delayTimeInMs: 1000
  }
};
