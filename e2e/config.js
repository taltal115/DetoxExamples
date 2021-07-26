const reporters = [
  "jest-standard-reporter",
  'detox/runners/jest/streamlineReporter',
  [
    'jest-html-reporters',
    {
      publicPath: './reports/html-report',
      expand: true,
      openReport: false,
    },
  ],
];

if (process.env.REPORTPORTAL_BUILD_ID) {
  reporters.push([
    '@reportportal/agent-js-jest',
    {
      token: process.env.REPORTPORTAL_UUID,
      endpoint: process.env.REPORTPORTAL_ENDPOINT,
      project: process.env.REPORTPORTAL_PROJECT,
      launch: process.env.REPORTPORTAL_LAUNCH,
      description: 'YourDescription',
      // mode: 'DEBUG',
      debug: false,
      attributes: [
        {
          key: 'Build Server',
          value: process.env.REPORTPORTAL_BUILD_SERVER,
        },
        {
          key: 'Job',
          value: process.env.REPORTPORTAL_JOB,
        },
        {
          key: 'Type',
          value: process.env.REPORTPORTAL_TEST_TYPE,
        },
        {
          key: 'Build ID',
          value: process.env.REPORTPORTAL_BUILD_ID,
        },
      ],
    },
  ]);
}
console.log(process.env.REPORTPORTAL_BUILD_ID, reporters);

module.exports = {
  testEnvironment: './environment',
  testRunner: 'jest-circus/runner',
  testTimeout: 120000,
  testRegex: '\\.e2e\\.ts$',
  reporters: reporters,
  verbose: true,
};
