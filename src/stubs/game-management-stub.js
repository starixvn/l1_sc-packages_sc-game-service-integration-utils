import nock from "nock";
import { Currencies, CurrencyGroupGames, CurrencyGroups, gameConfigs as GameConfigModel, PartnerConfigs, userInfos as UserInfoModel } from "sc-base-database";

export const subGameManagementService = async (appConfigs, definition) => {
    await stubGameConfig(appConfigs, definition);
    stubArchiveStatus(appConfigs, definition);
    stubNotification(appConfigs, definition);
    stubExchangeRate(appConfigs);
    await stubCurrencyGroupGame(appConfigs, definition);
    await stubOperatorConfig(appConfigs);
    await stubCurrencyGroup(appConfigs);
    await stubCurrency(appConfigs);
    stubPromotion(appConfigs, definition);
    await stubUserInfo(appConfigs);
    await stubBots(appConfigs);
    stubUserStakeLevel(appConfigs);
    stubDomains(appConfigs);
    await stubAggregation(appConfigs, definition);
};

const buildResult = (data) => {
    return {
        errorCode: 0,
        errorMessage: "",
        isSuccessful: true,
        data,
    };
};

const stubAggregation = async (appConfigs, definition) => {
    const data = {
        currencyGroupGames: await CurrencyGroupGames.find({}).lean().exec(),
        partnerGameSiteExclusions: await PartnerConfigs.find({}).lean().exec(),
        currencyGroups: await CurrencyGroups.find({}).lean().exec(),
        currencies: await Currencies.find({}).lean().exec(),
    };

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/aggregation/get-setting-for-new-round?gameId=${definition.id}`, () => true)
        .reply(200, buildResult(data));
};

const stubGameConfig = async (appConfigs, definition) => {
    const data = await GameConfigModel.findOne({ name: definition.configName }).lean().exec();
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/game-configs?gameName=${definition.configName}`, () => true)
        .reply(200, buildResult(data));
};

const stubArchiveStatus = (appConfigs, definition) => {
    const data = {
        name: definition.configName,
        lastArcId: {
            _rounds: 5,
        },
    };

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/archive-status?gameName=${definition.configName}`, () => true)
        .reply(200, buildResult(data));
};

const stubNotification = (appConfigs, definition) => {
    const data = {
        messages: {
            "vi-VN": "Game dang duoc bao tri",
            "en-US": "Game is under maintenance",
        },
    };

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/notification/um-messages?configName=${definition.configName}`, () => true)
        .reply(200, buildResult(data));
};

const stubExchangeRate = (appConfigs) => {
    const data = {
        exId: 1,
        source: "Fake",
        code: {
            AUD: 0.74886,
            CAD: 0.80865,
            CNY: 0.15664,
            EUR: 1.16282,
            GBP: 1.37699,
            HKD: 0.12864,
            IDR: 0.07059,
            JPY: 0.0088,
            MYR: 0.24103,
            PHP: 0.01973,
            SGD: 0.74279,
            THB: 0.03023,
            TWD: 0.03589,
            USD: 1,
            VND: 0.00004403,
        },
    };

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/exchange-rates`, () => true)
        .reply(200, buildResult(data));
};

const stubCurrencyGroupGame = async (appConfigs, definition) => {
    const data = await CurrencyGroupGames.find({}).lean().exec();

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/currency-group-games?gameId=${definition.id}`, () => true)
        .reply(200, buildResult(data));
};

const stubOperatorConfig = async (appConfigs) => {
    const data = await PartnerConfigs.find({}).lean().exec();

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/operator-config/game-site-exclusions`, () => true)
        .reply(200, buildResult(data));
};

const stubCurrencyGroup = async (appConfigs) => {
    const data = await CurrencyGroups.find({}).lean().exec();

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/currency-groups`, () => true)
        .reply(200, buildResult(data));
};

const stubCurrency = async (appConfigs) => {
    const data = await Currencies.find({}).lean().exec();

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/currencies`, () => true)
        .reply(200, buildResult(data));
};

const stubUserInfo = async (appConfigs) => {
    const userInfo = await UserInfoModel.findOne({ UID: 1 }).lean().exec();

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/users/info?id=${userInfo.id}`, () => true)
        .reply(200, buildResult(userInfo));

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/set-balance`, () => true)
        .reply(200, buildResult(userInfo));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/set-balance-and-decrease-scoins`, () => true)
        .reply(200, buildResult(userInfo));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/update-balance`, () => true)
        .reply(200, buildResult(userInfo));

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/update-stake-level`, () => true)
        .reply(200, buildResult({}));
};

const stubBots = async (appConfigs) => {
    const bots = await UserInfoModel.find({ type: true }).lean().exec();

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/bots/reset-in-room`, () => true)
        .reply(200, buildResult({}));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/bots/out-room`, () => true)
        .reply(200, buildResult({}));
    nock(appConfigs.gameManagementApiSettings.BASE).persist().get(`/users/bots`).query(true).reply(200, buildResult(bots));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/users/bots/total`, () => true)
        .reply(200, buildResult(bots.length));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/users/bots/disabled-bots`, () => true)
        .reply(200, buildResult([]));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/bots/join-room`, () => true)
        .reply(200, buildResult({}));
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/update-bots-balance`, () => true)
        .reply(200, buildResult([bots[0]]));
};

const stubPromotion = (appConfigs, definition) => {
    const data = [
        {
            odds: {
                even: 2,
                odd: 2,
                red3: 3.75,
                white3: 3.75,
                red4: 14.4,
                white4: 14.4,
            },
            startDateTime: {
                $date: "2023-04-09T01:00:00.000Z",
            },
            endDateTime: {
                $date: "2023-04-22T11:00:00.000Z",
            },
            status: "deleted",
            isDaily: false,
        },
        {
            odds: {
                big: 2,
                small: 2,
            },
            startDateTime: {
                $date: "2023-04-04T21:55:00.000Z",
            },
            endDateTime: {
                $date: "2023-04-21T21:55:00.000Z",
            },
            status: "enabled",
            isDaily: false,
        },
    ];

    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/promotion?gameId=${definition.id}`, () => true)
        .reply(200, buildResult(data));
};

const stubUserStakeLevel = (appConfigs) => {
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .post(`/users/update-stake-level`, () => true)
        .reply(200, buildResult({}));
};

const stubDomains = (appConfigs) => {
    const data = { value: "lumigame.com;luminetsoft.com" };
    nock(appConfigs.gameManagementApiSettings.BASE)
        .persist()
        .get(`/domain`, () => true)
        .reply(200, buildResult(data));
};
