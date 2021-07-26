import detox from 'detox';
import { IS_ANDROID } from '../utils';
import genericKeys from '../data/keys/genericKeys';
const jestExpect = require('expect');

/**
 * This function serves as a wrapper for the detox functions/helpers
 * to retry activating the functions in case detox did not manage to perform the task
 * on the first attempt.
 */
const tryCatched = async (detoxFunc: () => Promise<void>): Promise<void> => {
  try {
    await waitSec();
    await detoxFunc();
  } catch {
    await waitSec();
    await detoxFunc();
  }
};

/**
 * This function will be your first choice if you need to check if Element toExist By text
 * When you use this function detox will use detox async mechanism.
 * @example
 * await detoxHelper.areUniqueElementsExistByText(['UniqueText','UniqueText1','UniqueText2']);
 **/
const areUniqueElementsExistByText = async (...searchTexts: string[]) => {
  const searchhUniqElementsPromisesArray = [];
  searchTexts.forEach((element) => {
    searchhUniqElementsPromisesArray.push(detox.expect(detox.element(by.text(element))).toExist());
  });
  Promise.all(searchhUniqElementsPromisesArray).then((values) => {});
};
/**
 * This function will be your first choice if you need to check if Element Visible By Id
 * When you use this function detox will use detox async mechanism.
 * @example
 * await detoxHelper.isElementVisibleById('somekey');
 **/
const isElementVisibleById = async (id: string, index?: number): Promise<void> => {
  const isElementVisible = async (): Promise<void> => {
    if (index >= 0) {
      await detox.expect(detox.element(by.id(id)).atIndex(index)).toBeVisible();
    } else {
      await detox.expect(detox.element(by.id(id))).toBeVisible();
    }
  };
  await tryCatched(isElementVisible);
};

const isElementNotVisibleById = async (id: string, index?: number): Promise<void> => {
  const isElementNotVisible = async (): Promise<void> => {
    if (index >= 0) {
      await detox.expect(detox.element(by.id(id)).atIndex(index)).not.toBeVisible();
    } else {
      await detox.expect(detox.element(by.id(id))).toBeNotVisible();
    }
  };
  await tryCatched(isElementNotVisible);
};

/**
 * This function will be your first choice if you want to click on element.
 * When you use this function detox will use detox async mechanism.
 * @example
 * await detoxHelper.clickElementById('somekey');
 **/
const clickElementById = async (id: string, index?: number, waitUntilElementIsEnabled?: boolean): Promise<void> => {
  console.log(`[clickElementById] id: ${id}`);
  const clickElement = async (): Promise<void> => {
    if (waitUntilElementIsEnabled) {
      await waitForElementToBeEnabledById(id, undefined, index);
    }
    if (index >= 0) {
      await detox.element(by.id(id)).atIndex(index).tap();
    } else {
      await detox.element(by.id(id)).tap();
    }
  };
  await tryCatched(clickElement);
};

const clickElementAtPointById = async (id: string, x: number, y: number, index?: number): Promise<void> => {
  const clickAtPoint = async (): Promise<void> => {
    const elm = getElementById(id, index);
    await elm.tap({ x, y });
  };
  await tryCatched(clickAtPoint);
};

const getElementById = (id: string, index?: number) => {
  return index >= 0 ? detox.element(by.id(id)).atIndex(index) : detox.element(by.id(id));
};

const getElementByIdWithParent = (elementId: string, parentId: string, index?: number) => {
  const byElementId = by.id(elementId);
  const byParentId = by.id(parentId);
  return index >= 0 ? detox.element(byElementId.withAncestor(byParentId)).atIndex(index) : detox.element(byElementId.withAncestor(byParentId));
};

const clickElementWithParentById = async (elementId: string, parentId: string, index?: number): Promise<void> => {
  const element = getElementByIdWithParent(elementId, parentId, index);
  await element.tap();
};

/**
 * This function will be your second choice if you want to check if Element Visible By Id.
 * When you use this function detox will have 'timeInSeconds' timeout, This function  will be use when you have a long animation waiting.
 * @example
 * await detoxHelper.waitForElementById('somekey',9000);
 **/
const waitForElementById = async (id: string, timeInSeconds = 7, index?: number): Promise<void> => {
  const elm = getElementById(id, index);
  await detox
    .waitFor(elm)
    .toBeVisible()
    .withTimeout(timeInSeconds * 1000);
};

const waitForElementToBeEnabledById = async (id: string, timeInSeconds = 7, index?: number): Promise<void> => {
  let continueWaiting = true;
  let timeRemaining = timeInSeconds;
  const waitIfElementStillNotEnable = async () => {
    try {
      const attributes = await getElementById(id, index).getAttributes();
      jestExpect(attributes.enabled).toEqual(true);
      continueWaiting = false;
    } catch {
      if (timeRemaining-- <= 0) {
        throw new Error(`${id} element still disabled after ${timeInSeconds} seconds, or not found`);
      }
      await waitSec(1);
    }
  };
  while (continueWaiting) {
    await waitIfElementStillNotEnable();
  }
};

/**
 * Use it only if waitForElementById is not working for you.
 */
const waitForElementToBeDisplayedById = async (id: string, timeInSeconds = 7, index?: number): Promise<void> => {
  let continueWaiting = true;
  let timeRemaining = timeInSeconds;
  const waitIfElementStillNotVisible = async () => {
    try {
      await expect(getElementById(id, index)).toBeVisible();
      continueWaiting = false;
    } catch {
      if (timeRemaining-- <= 0) {
        throw new Error(`Cannot find the ${id} element after ${timeInSeconds} seconds`);
      }
      await waitSec(1);
    }
  };
  // eslint-disable-next-line no-unmodified-loop-condition
  while (continueWaiting) {
    await waitIfElementStillNotVisible();
  }
};

const waitForElementToNotBeDisplayedById = async (id: string, timeInSeconds = 7, index?: number): Promise<void> => {
  const waitForElement = async (): Promise<void> => {
    const elm = getElementById(id, index);
    await detox
      .waitFor(elm)
      .not.toBeVisible()
      .withTimeout(timeInSeconds * 1000);
  };
  await tryCatched(waitForElement);
};

/**
 * This function will be your seconed choice if you want to check if Element Visible By Id and click on it.
 * When you use this function detox will have 'timeInSeconds' timeout, This function  will be use when you have a long animation waiting.
 * @example
 * await detoxHelper.waitForElementByIdNClick('someKeys');
 **/
const waitForElementByIdNClick = async (id: string, timeInSeconds = 7, index?: number): Promise<void> => {
  const waitForElement = async (): Promise<void> => {
    await waitForElementById(id, timeInSeconds, index);
    await waitSec();
    if (index >= 0) {
      await detox.element(by.id(id)).atIndex(index).tap();
    } else {
      await detox.element(by.id(id)).tap();
    }
  };
  await tryCatched(waitForElement);
};

/**
 * This function will be use to scroll by id scroller.
 * It will scroll till the end of the direction in the page
 * @example
 * await detoxHelper.scrollToById('somekey','bottom');
 **/
const scrollToById = async (id: string, direction: Detox.ScrollDirection): Promise<void> => {
  const scroll = async (): Promise<void> => {
    await detox.element(by.id(id)).scrollTo(direction);
  };
  await tryCatched(scroll);
};

/**
 * This function will be use to scroll by id scroller.
 * It will scroll by the number of pixels it get.
 * @example
 * await detoxHelper.scrollById('somekey','bottom');
 **/
const scrollById = async (id: string, direction: Detox.Direction, pixels: number, startPositionX1 = 0.5, startPositionY = 0.8): Promise<void> => {
  const scroll = async (): Promise<void> => {
    await waitForElementById(id);
    await detox.element(by.id(id)).scroll(pixels, direction, startPositionX1, startPositionY);
  };
  await tryCatched(scroll);
};

/**
 * This function will be use to scroll by id scroller until it found the element.
 * It will scroll by the number of pixels it get.
 * @example
 * await detoxHelper.scrollById('somekey','bottom');
 **/
const scrollToVisibleById = async (id: string, scrollViewId: string, direction: Detox.Direction, pixels = 500, startPositionX = 0.5, startPositionY = 0.8): Promise<void> => {
  const scrollToVisible = async (): Promise<void> => {
    await waitForElementById(scrollViewId);
    await waitFor(element(by.id(id)))
      .toBeVisible()
      .whileElement(by.id(scrollViewId))
      .scroll(pixels, direction, startPositionX, startPositionY);
  };
  await tryCatched(scrollToVisible);
};

/**
 * Use it only if scrollToVisibleById is not working for you!!!
 * This function will be use to scroll by id scroller until it found the element.
 * It will scroll by the number of pixels it get.
 * @example
 * await detoxHelper.scrollToBeVisibleByID('id','scrollViewId');
 **/
const scrollToBeVisibleByID = async (id: string, scrollViewId: string, index?: number, direction: Detox.Direction = 'down', pixels = 400, maxScrollTimes = 10): Promise<void> => {
  const scrollToBeVisible = async (): Promise<void> => {
    await isElementVisibleById(scrollViewId);
    let continueScroll = true;
    let failedTimes = 0;
    const scrollIfElementIsNotVisible = async () => {
      try {
        await expect(getElementById(id, index)).toBeVisible();
        continueScroll = false;
      } catch {
        if (failedTimes++ >= maxScrollTimes) {
          throw new Error(`Cannot find the ${id} element while scrolling the ${scrollViewId}`);
        }
        await scrollById(scrollViewId, direction, pixels);
      }
    };
    // eslint-disable-next-line no-unmodified-loop-condition
    while (continueScroll) {
      await scrollIfElementIsNotVisible();
    }
  };
  await tryCatched(scrollToBeVisible);
};

const scrollToBeVisibleByText = async (text: string, scrollViewId: string, direction: Detox.Direction = 'down', pixels = 400, maxScrollTimes = 10): Promise<void> => {
  const scrollToBeVisible = async (): Promise<void> => {
    await waitForElementById(scrollViewId);
    let continueScroll = true;
    let failedTimes = 0;
    const scrollIfElementIsNotVisible = async () => {
      try {
        direction === 'right' ? await waitForElementByText(text) : await verifyTextDisplayed(text);
        continueScroll = false;
      } catch {
        if (failedTimes++ >= maxScrollTimes) {
          throw new Error(`Cannot find the ${text} element while scrolling the ${scrollViewId}`);
        }
        await scrollById(scrollViewId, direction, pixels);
      }
    };
    // eslint-disable-next-line no-unmodified-loop-condition
    while (continueScroll) {
      await scrollIfElementIsNotVisible();
    }
  };
  await tryCatched(scrollToBeVisible);
};

/**
 * This function will be swipe for carousel .
 * It will swipe by the number of pixels it get.
 * @example
 * await detoxHelper.swipeById('somekey','left');
 **/
const swipeById = async (id: string, direction: Detox.Direction, percentage?: number): Promise<void> => {
  const swipe = async (): Promise<void> => {
    await detox.element(by.id(id)).swipe(direction, 'fast', percentage);
  };
  await tryCatched(swipe);
};

/**
 * This function will find if Text component have the right text by finding the id.
 * @example
 * await detoxHelper.checkTextById('somekey','bkakvakakvakakvka');
 **/
const checkTextById = async (id: string, text: string, index?: number): Promise<void> => {
  const checkText = async (): Promise<void> => {
    if (index >= 0) {
      await detox.expect(detox.element(by.id(id)).atIndex(index)).toHaveText(text);
    } else {
      await detox.expect(detox.element(by.id(id))).toHaveText(text);
    }
  };
  await tryCatched(checkText);
};

/**
 * This function will find if Elements is exist in the page, it's not need to be visible
 * @example
 * await detoxHelper.checkIfElementsExist(2,'someKeys');
 **/
const checkIfElementsExist = async (length: number, id: string): Promise<void> => {
  const checkIfElements = async (): Promise<void> => {
    for (let index = 0; index < length; index++) {
      await detox.expect(detox.element(by.id(id)).atIndex(index)).toExist();
    }
  };
  await tryCatched(checkIfElements);
};

const verifyElementIsNotExistById = async (id: string): Promise<void> => {
  const verifyElement = async (): Promise<void> => {
    await detox.expect(detox.element(by.id(id))).not.toExist();
  };
  await tryCatched(verifyElement);
};

const clickOnNativeWebViewBackButton = async (backTabName = 'Account'): Promise<void> => {
  const clickOnNativeWebView = async (): Promise<void> => {
    if (IS_ANDROID) {
      await waitForElementByIdNClick(genericKeys.androidWebViewBack);
    } else {
      await waitForElementById(backTabName, 1);
      await clickElementByText(backTabName, 0);
    }
  };
  await tryCatched(clickOnNativeWebView);
};

/**
 * Use it if you need to traverse back multiple webview stacks before returning to a native page.
 * @param id id of element to search for
 * @param backTabName tab to return to after clicking back
 * @param maxClickTimes optional, max num times to search before throwing an error
 */
const clickOnNativeWebViewBackButtonUntilVisible = async (id: string, backTabName = 'Account', maxClickTimes = 3): Promise<void> => {
  let continueClick = true;
  let failedTimes = 0;
  const clickOnWebViewBackButtonUntilVisible = async (): Promise<void> => {
    const clickIfElementIsNotVisible = async () => {
      try {
        await waitForElementById(id);
        continueClick = false;
      } catch {
        if (failedTimes++ >= maxClickTimes) {
          throw new Error(`Cannot find the ${id} element while performing native web back button click`);
        }
        await clickOnNativeWebViewBackButton(backTabName);
      }
    };
    // eslint-disable-next-line no-unmodified-loop-condition
    while (continueClick) {
      await clickIfElementIsNotVisible();
    }
  };
  await tryCatched(clickOnWebViewBackButtonUntilVisible);
};

const clickOnWebViewBackButton = async (): Promise<void> => {
  const id = IS_ANDROID ? 'backWebView' : 'BackButton';
  const clickOnBackButton = async (): Promise<void> => {
    await waitSec(3);
    await waitForElementById(id);
    await clickElementById(id, 0);
  };
  await tryCatched(clickOnBackButton);
};

const clickOnNativeBackButton = async (iosButtonIndex = 1): Promise<void> => {
  const clickOnBackButton = async (): Promise<void> => {
    if (IS_ANDROID) {
      await device.pressBack();
    } else {
      await element(by.traits(['button']))
        .atIndex(iosButtonIndex)
        .tap();
    }
  };
  await tryCatched(clickOnBackButton);
};

// TODO: Remove this method when ios back button includes test id
const clickOnNativeTextBackButton = async (text: string, iosButtonIndex = 1): Promise<void> => {
  const clickOnBackButton = async (): Promise<void> => {
    if (IS_ANDROID) {
      await device.pressBack();
    } else {
      await element(by.text(text)).atIndex(iosButtonIndex).tap();
    }
  };
  await tryCatched(clickOnBackButton);
};

/**
 * This function will help us contain detox throw, in case we need to make detoxHelper function return a boolean.
 * Then whenever we want to check during a test if some element is available without breaking the test, we can use this method.
 *
 * Usage:
 * const isCloseButtonExists = withBooleanWrapper(waitForElementByText, 'close', 5);
 **/
const withBooleanWrapper = async (detoxHelperFn: (...args: any) => Promise<void>, ...args: any[]): Promise<boolean> => {
  try {
    await detoxHelperFn(...args);
    return Promise.resolve(true);
  } catch (e) {
    return Promise.resolve(false);
  }
};

/**
 * This function will be use as a last resort when there is some animation and you can't handle the detox async mechanism.
 * Usage:
 * await detoxHelper.waitSec();
 **/
const waitSec = (delayInSec?: number): Promise<void> => {
  // There is a limit in detox to 1500 for setTimeout
  // otherwise it ignore them
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, (delayInSec || 1) * 1000);
  });
};

/**
 * We want to search an elment only by id !
 *
 * so use it as a last resort.
 **/
const clickElementByText = async (text: string, index?: number): Promise<void> => {
  const clickElement = async (): Promise<void> => {
    if (index >= 0) {
      await detox.element(by.text(text)).atIndex(index).tap();
    } else {
      await detox.element(by.text(text)).tap();
    }
  };
  await tryCatched(clickElement);
};

/**
 * We want to search an elment only by id !
 *
 * so use it as a last resort.
 **/
const waitForElementByText = async (text: string, timeInSeconds = 7, index?: number): Promise<void> => {
  const elm = index >= 0 ? element(by.text(text)).atIndex(index) : element(by.text(text));
  await waitFor(elm)
    .toBeVisible()
    .withTimeout(timeInSeconds * 1000);
};

/**
 * We want to search an elment only by id !
 *
 * so use it as a last resort.
 **/
const waitForElementByTextNClick = async (text: string, timeInSeconds = 7, index?: number): Promise<void> => {
  const waitForElement = async (): Promise<void> => {
    await waitForElementByText(text, timeInSeconds, index);
    await waitSec();
    if (index >= 0) {
      await detox.element(by.text(text)).atIndex(index).tap();
    } else {
      await detox.element(by.text(text)).tap();
    }
  };
  await tryCatched(waitForElement);
};

/**
 * We want to search an elment only by id !
 *
 * so use it as a last resort.
 **/
const verifyTextDisplayed = async (text: string, index = 0): Promise<void> => {
  const verifyText = async (): Promise<void> => {
    await detox.expect(element(by.text(text)).atIndex(index)).toBeVisible();
  };
  await tryCatched(verifyText);
};

/**
 * We want to search an elment only by id !
 *
 * so use it as a last resort.
 **/
const verifyTextNotDisplayed = async (text: string, index = 0): Promise<void> => {
  const verifyText = async (): Promise<void> => {
    await expect(element(by.text(text)).atIndex(index)).not.toBeVisible();
  };
  await tryCatched(verifyText);
};

/**
 * Get all views in the container that their id is contains specific str
 * @param viewContainerId
 * @param idContains
 * IOS only
 */
const getAllViewsIntoViewContainerByIdContains = async (viewContainerId: string, idContains: string): Promise<any[]> => {
  const allViewsInTheContainer = await detox.element(by.type('UIView').withAncestor(by.id(viewContainerId)));
  const attributes = await allViewsInTheContainer.getAttributes();
  return attributes.elements.filter((e) => Object.keys(e).includes('identifier') && e.identifier.includes(idContains));
};

/**
 * Return all the UI elements on the screen
 * IOS only
 */
const getAllUiElementsOnTheScreen = async () => {
  const allViewsInTheContainer = await detox.element(by.type('UIView'));
  return allViewsInTheContainer.getAttributes();
};

/**
 * Write to file all UI elements into the screen
 * Don't delete this func. It's for dev/debug using.
 * The file will be saved on the ./temp location
 * IOS only
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const writeToFileAllElementsOnTheScreen = async (fileName = 'allUiElementsOnTheScreen'): Promise<void> => {
  const allUiElementsOnTheScreen = await getAllUiElementsOnTheScreen();
  await writeToFile(allUiElementsOnTheScreen, fileName);
};

/**
 * Write to file any object as JSON format
 * @param obj to write
 * @param fileName
 * The file will be saved on the ./temp location
 * Don't delete this func. It's for dev/debug using.
 */
const writeToFile = async (obj: any, fileName: string) => {
  const fs = require('fs');
  fs.writeFile(`./temp/${fileName}.json`, JSON.stringify(obj), function (err) {
    if (err) {
      console.log(err);
    }
    console.log(`${fileName} file was saved!`);
  });
};

const isWebViewPageDisplayed = async (): Promise<void> => {
  const webClassName = IS_ANDROID ? 'myatt_web_view' : 'WKWebView';
  await detox.expect(element(by.type(webClassName))).toBeVisible();
};

const getTextById = async (id: string): Promise<string> => {
  const attributes = await getElementById(id).getAttributes();
  return IS_ANDROID ? attributes.text : attributes.label;
};

const waitForWebViewPageToBeDisplayed = async (timeInSeconds = 7): Promise<void> => {
  // Verifies Android webview presence by using its back button identifier because Detox fails to identify the webview's id/tag
  const webClassName = IS_ANDROID ? 'backWebView' : 'WKWebView';
  IS_ANDROID
    ? await waitForElementById(webClassName, 20)
    : await detox
        .waitFor(element(by.type(webClassName)))
        .toBeVisible()
        .withTimeout(timeInSeconds * 1000);
};

const clickOnApplicationBackArrowButton = async (): Promise<void> => {
  const clickOnApplicationBackButton = async (): Promise<void> => {
    const id = IS_ANDROID ? 'backWebView' : 'BackButton';
    await waitForElementById(id);
    await clickElementById(id, 0);
  };
  await tryCatched(clickOnApplicationBackButton);
};

export default {
  waitSec,
  waitForElementById,
  waitForElementByText,
  clickElementById,
  isElementVisibleById,
  isElementNotVisibleById,
  scrollToById,
  scrollToVisibleById,
  scrollById,
  swipeById,
  clickElementByText,
  checkTextById,
  checkIfElementsExist,
  waitForElementByIdNClick,
  verifyTextDisplayed,
  verifyTextNotDisplayed,
  waitForElementByTextNClick,
  clickOnNativeWebViewBackButton,
  clickOnNativeWebViewBackButtonUntilVisible,
  clickOnNativeBackButton,
  clickOnWebViewBackButton,
  clickOnNativeTextBackButton,
  withBooleanWrapper,
  waitForWebViewPageToBeDisplayed,
  isWebViewPageDisplayed,
  clickElementAtPointById,
  getAllViewsIntoViewContainerByIdContains,
  verifyElementIsNotExistById,
  clickOnApplicationBackArrowButton,
  waitForElementToNotBeDisplayedById,
  scrollToBeVisibleByID,
  getElementById,
  getElementByIdWithParent,
  waitForElementToBeDisplayedById,
  scrollToBeVisibleByText,
  areUniqueElementsExistByText,
  tryCatched,
  clickElementWithParentById,
  writeToFileAllElementsOnTheScreen,
  getTextById,
};
