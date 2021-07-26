const { DetoxCircusEnvironment, SpecReporter, WorkerAssignReporter } = require('detox/runners/jest-circus');

const dotenv = require('dotenv');

process.env.TEST_TYPE &&
  dotenv.config({
    path: `.detox.env`,
  });

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context);

    // Can be safely removed, if you are content with the default value (=300000ms)
    this.initTimeout = 300000;

    this.failedTest = false;

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    this.registerListeners({
      SpecReporter,
      WorkerAssignReporter,
    });
  }

  async handleTestEvent(event, state) {
    if (event.name === 'hook_failure' || event.name === 'test_fn_failure') {
      this.failedTest = true;
    } else if (this.failedTest && event.name === 'test_start') {
      event.test.mode = 'skip';
    }

    if (super.handleTestEvent) {
      await super.handleTestEvent(event, state);
    }
  }
}

module.exports = CustomDetoxEnvironment;
