## Building And Running Detox ##

### iOS ###

IMPORTANT: Dont run metro bundler (i.e. npm start, npm run start:detox) - we now bundle js files into app file, there is an option to debug while running detox tests (described below), but before pushing make sure it works without running metro.

```js
    // build the app for detox
    npm run detox-build:ios
    // then run sanity
    npm run detox-run:ios:tests-list-Sanity
    // or run nightly
    npm run detox-run:ios:tests-list-Nightly
    // or run any tests
    npm run detox-run:ios {testregex}
```
Example:
```js
npm run detox-run:ios insurance.positive.e2e.ts
```

### Android ###
Running & building on Android
```js
// initial setup 
npm run android-emulator:install-package  // install the sdk package
npm run android-emulator:create-avd       // create the avd

// run emulator
npm run android-emulator:start            // start the emulator with proper params

// build for detox
npm run detox-build:android

// run tests 
npm run detox-run:android {file name, test names regex}
// or
npm run detox-run:ios:tests-list-Sanity
// or
npm run detox-run:ios:tests-list-Nightly

// windows ??
npm run detox-build:android:windows
npm run detox-run:android:e2be:windows
```


To configure the emulator localy with the basic requirements
add the following to ~/.android/avd/Pixel_4_API_30.avd/config.ini
```
hw.lcd.density=480
hw.keyboard=yes
disk.dataPartition.size=2048MB
```

### Debug Detox E2E Tests ###
run metro bundler for detox - please use just for debugging. before you push run the above way to make sure it passes jenkins 
```js
npm run start:detox
```
## Run Detox E2E Tests
## Android
```js
npm run detox-build:android
npm run detox-run:android ....
```

## IOS ##
```js
npm run detox-build:ios:debug
npm run detox-run:ios
```
### Developing Detox Tests

The test files are found in e2e/tests folder.

Detox test is implemented in one test file and contains one scenario that we implement.
multipe 'it' sections may be used to improve readablity of the test.

Detox test should be undependendant of other tests or the app current state (like local storage).
Since each test is independant and isolated it should always start with launching the the myAtt app.

Always provide the exact set of flags (feature flags) that your tests depends on, all other flags will have the default value.

So basically every test look something like this:

```ts
beforeAll(async () => {
    await appCommon.startApp({
      permissions: { notifications: 'YES', location: 'always' },
      userName: 'default-client',
      doSetup: false,
      doLoginSkip: false,
      featureFlags: {
        'svc-should-use-react-native-setup-flow-ios': true,
        'svc-should-use-react-native-setup-flow': true
      }
    });
  });
it('should show ShopLabder, when clicking on shop button', async()=> {
    // click on button 
    // assert .....
});
it('should ....', async()=>{ ... });
```

if you are writing a test that needs a loged-in use the login flow use:
common.login(users.wirelessUsers.happyUser);
currently this actually logs-in using the environment screen (will be silent in the future).

you can provide to the appCommon.startApp method the following:
* username - the user to login with (BE mock)
* pemissions - permissions the app have: location access, notifications
* feature-flags
* experiments
* doSetup - should the app start with setupFlow? ususaly not but you can if you provide true here.
* doLoginSkip - Bypass Login by predefine BeMock with the defined "userName"

[More detailed examples](https://wiki.web.att.com/display/myattmobile/How+to+work+with+Detox)

## Sanity & Nightly ##
Sanity Test list is running on every created PR.
Nightly Tests list is exucuted, surprisingly enery night.
In order to verify that all your detox tests work correctly in the Jenkins (no location problems), you should check and run before merging with the master.

Detox only pipeline (Jenkins) allows you to run only detox tests without other pipline stages, [Detox_Only on jenkins](https://sdt-community-two.vci.att.com:19592/jenkins/job/com.att.myattmobile/job/Mobile_apps/job/0.Detox_only/). Press "Build with Parameters", select the suite you wish to run and hit "Build".


### Add tests to Nightly/Sanity suits ###

* Add the file name to [detox_suites.json](./detox/detox_suites.json) under the proper suite name.
* If you add a test to the Sanity list, please create PR and add YEHONATAN SEGEV (ys9619) as a reviewer, he is mandatory for our Sanity ([Read more on Sanity List](https://wiki.web.att.com/display/myattmobile/Detox+Sanity+Plan))


