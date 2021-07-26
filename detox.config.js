require('dotenv').config({ path: '.detox.env' });

const { ADB_DEVICE_SERIAL: adbName, AVD_NAME: avdName, IPHONE_MODEL, USE_ANDROID_DEVICE } = process.env;

const ANDROID_TYPE = `android.${JSON.parse(USE_ANDROID_DEVICE || 'false') ? 'attached' : 'emulator'}`;

let excludedArchs = '';

// retrieve Xcode version from command line with `xcodebuild -version`
try {
  if (process.platform === 'darwin') {
    const execSync = require('child_process').execSync;
    const output = execSync('xcodebuild -version', { encoding: 'utf-8' });
    const version = Number(output.split('\n')[0].split(' ')[1]);
    excludedArchs = version >= 12 ? 'EXCLUDED_ARCHS=arm64' : '';
  }
} catch (error) {
  console.error(error);
}

module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.js',
  configurations: {
    'ios:jenkins': {
      type: 'ios.simulator',
      binaryPath: './ios/build/Build/Products/Debug-iphonesimulator/myATTThin.app',
      build: `cd ./ios && export FORCE_BUNDLING=true && xcodebuild clean build -quiet -workspace myATTThin.xcworkspace -scheme "myATT" SWIFT_ACTIVE_COMPILATION_CONDITIONS='$(inherited) DETOX' -configuration Debug -sdk iphonesimulator -derivedDataPath ./build ${excludedArchs}`,
      device: {
        type: IPHONE_MODEL,
      },
    },
    'ios:debug': {
      type: 'ios.simulator',
      binaryPath: './ios/build/Build/Products/Debug-iphonesimulator/myATTThin.app',
      build: `cd ./ios && export FORCE_BUNDLING=true && xcodebuild clean build -quiet -workspace myATTThin.xcworkspace -scheme "myATT" SWIFT_ACTIVE_COMPILATION_CONDITIONS='$(inherited) DETOX DETOXMETRO' -configuration Debug -sdk iphonesimulator -derivedDataPath ./build ${excludedArchs}`,
      device: {
        type: IPHONE_MODEL,
      },
    },
    'android:windows': {
      type: ANDROID_TYPE,
      binaryPath: '..\\android\\myatt-thin-native-android\\MyAttNative\\build\\outputs\\apk\\detox\\debug\\MyAttNative-detox-debug.apk',
      build: 'cd ..\\android\\myatt-thin-native-android && .\\gradlew --parallel assembleDetoxDebug assembleAndroidTest -DtestBuildType=debug && cd ..\\..\\js',
      device: {
        avdName,
        adbName,
      },
    },
    android: {
      type: ANDROID_TYPE,
      binaryPath: './android/MyAttNative/build/outputs/apk/detox/debug/MyAttNative-detox-debug.apk',
      build: 'cd ./android && ./gradlew --parallel assembleDetoxDebug assembleAndroidTest  -DtestBuildType=debug',
      device: {
        avdName,
        adbName,
      },
    },
  },

  artifacts: {
    rootDir: 'e2e/.artifacts/',
    plugins: {
      instruments: { enabled: false },
      log: {
        mode: 'all',
        enabled: true,
      },
      uiHierarchy: 'false',
      screenshot: {
        shouldTakeAutomaticSnapshots: false,
        keepOnlyFailedTestsArtifacts: true,
        takeWhen: {
          testStart: false,
          testDone: true,
        },
      },
      video: {
        android: {
          bitRate: 4000000,
        },
        simulator: {
          codec: 'hevc',
        },
      },
    },
  },

  behavior: {
    init: {
      exposeGlobals: true,
      reinstallApp: true,
      launchApp: false,
    },
    launchApp: 'auto',
    cleanup: {
      shutdownDevice: false,
    },
  },
};
