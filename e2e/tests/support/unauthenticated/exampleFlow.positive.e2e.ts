import { Manager } from '../../../manager';
import { supportTabMainPageKeys } from '../../../pages/rn/SupportTabMainPage';
import detoxHelper from '../../../helpers/DetoxHelper';
import detox from 'detox';
import appCommon from '../../../common/appCommon';

describe('Positive support - Billing & Account Unauthenticated test', () => {
  const { pages } = Manager.getInstance();
  beforeAll(async () => {
    await appCommon.startApp({
      permissions: { notifications: 'YES', location: 'always' },
      userName: 'default-client',
      doSetup: false,
      doLoginSkip: false,
      featureFlags: {
        'svc-should-use-react-native-setup-flow-ios': true,
        'svc-should-use-react-native-setup-flow': true,
        'svc-should-skip-setup-flow': true,
      }
    });
  });
  const prefix = 'ContentCardCta-solutionsPanelBilling';

  it('Should navigate to support tab then -> Billing & Account', async () => {
    await pages.mainPage.clickOnSupportTab();
    await detox.element(by.text('Billing & Account')).tap();
  });

  describe('Should test page content -> Should verify BILLING SOLUTIONS card data', () => {
    const PanelContainerTestID = 'PanelContainer-solutionsPanelBilling';

    it(`Manage accounts & IDs`, async () => {
      // Arrange
      await detoxHelper.scrollToVisibleById(PanelContainerTestID, supportTabMainPageKeys.supportScrollView, 'down');
      // Assert
      await Promise.all([
        pages.supportTabMainPage.isCardExistsById(PanelContainerTestID),
        detoxHelper.verifyTextDisplayed('BILLING SOLUTIONS'),
        detoxHelper.verifyTextDisplayed('Manage accounts & IDs'),
        detoxHelper.verifyTextDisplayed('Learn how to create or link user IDs, reset passwords, and manage your accounts.'),
        detoxHelper.verifyTextDisplayed('Learn how to create or link user IDs, reset passwords, and manage your accounts.'),
        detoxHelper.isElementVisibleById(`${prefix}-Manageaccounts&IDs`),
        detoxHelper.checkTextById(`${prefix}-Manageaccounts&IDs`, 'Get account support'),
      ]);
    });

    it(`Payment options`, async () => {
      // Arrange
      await detoxHelper.scrollToVisibleById(PanelContainerTestID, supportTabMainPageKeys.supportScrollView, 'down');
      await detoxHelper.clickElementByText('Payment options');
      // Assert
      await Promise.all([
        detoxHelper.verifyTextDisplayed('Ways to pay your bill'),
        detoxHelper.verifyTextDisplayed('Explore ways to view and pay your bill, and understand your bill changes.'),
        detoxHelper.verifyTextDisplayed('Browse billing support'),
        detoxHelper.isElementVisibleById(`${prefix}-Waystopayyourbill`),
        detoxHelper.checkTextById(`${prefix}-Waystopayyourbill`, 'Browse billing support'),
      ]);
    });

    it(`Check usage`, async () => {
      // Arrange
      await detoxHelper.scrollToVisibleById(PanelContainerTestID, supportTabMainPageKeys.supportScrollView, 'down');
      await detoxHelper.clickElementByText('Check usage');
      // Assert
      await Promise.all([
        detoxHelper.verifyTextDisplayed('Usage info & alerts'),
        detoxHelper.verifyTextDisplayed('Find out how to check and manage usage. Plus, learn about usage alerts.'),
        detoxHelper.verifyTextDisplayed('Get usage support'),
        detoxHelper.isElementVisibleById(`${prefix}-Usageinfo&alerts`),
        detoxHelper.checkTextById(`${prefix}-Usageinfo&alerts`, 'Get usage support'),
      ]);
    });
  });

  describe(`Should test Want additional help? section`,  () => {
    it(`Should verify Move, change, suspend & cancel service card data`, async () => {
      // Arrange
      await detoxHelper.scrollToBeVisibleByText('Move, change, suspend & cancel service', supportTabMainPageKeys.supportScrollView, 'down');
      // Assert
      await detoxHelper.verifyTextDisplayed('Move, change, suspend & cancel service');
    });

    it(`Should verify Privacy, fraud & security card data`, async () => {
      // Arrange
      await detoxHelper.scrollToBeVisibleByText('Privacy, fraud & security', supportTabMainPageKeys.supportScrollView, 'down');
      // Assert
      await detoxHelper.verifyTextDisplayed('Privacy, fraud & security');
    });

    it(`Should verify Profile & contact info card data`, async () => {
      // Arrange
      await detoxHelper.scrollToBeVisibleByText('Profile & contact info', supportTabMainPageKeys.supportScrollView, 'down');
      // Assert
      await detoxHelper.verifyTextDisplayed('Profile & contact info');
    });
  });

  it(`Should verify the lower support section`, async () => {
    // Arrange
    await detoxHelper.scrollToVisibleById('buttonLinkLayoutContainer', supportTabMainPageKeys.supportScrollView, 'down');
    // Assert
    await Promise.all([
      detoxHelper.isElementVisibleById('ButtonLinkLayout-Text-contactUsPanel'),
      detoxHelper.checkTextById('ButtonLinkLayout-Text-contactUsPanel', 'Want more help?'),
      detox.expect(detox.element(by.id('buttonLinkLayoutExploreContactUsOptions').withDescendant(by.text('Get support & contact info')))).toExist()
    ]);
  });
});
