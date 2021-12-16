import { userInfos as UserInfoModel, users as UserModel, userSessions as UserSessionModel } from "sc-base-database";
import { PartnerConfigs, CurrencyGroups, Currencies, CurrencyGroupGames } from "sc-game-base/src/core/models";

export const createDummyUser = async (memberId, memberName, currencyName, currencyCode, partnerId) => {
    await createPartnerConfig(partnerId);
    const currencyGroup = await createCurrencyGroup(partnerId);
    await createCurrency(currencyGroup._id);
    await createCurrencyGroupGames(currencyGroup._id);

    const user = await createUserRecord(memberId, memberName, currencyName);
    const userInfo = await createUserInfoRecord(user);
    const userSession = await createUserSessionRecord(user, currencyCode, currencyGroup._id);

    return {
        user,
        userInfo,
        userSession,
    };
};

const createUserRecord = async (memberId, memberName, currency) => {
    const user = {
        local: {
            username: `${memberId}_${memberName}`,
            password: "dummy-password",
            lastDate: new Date(),
            lastLogin: new Date(),
            regDate: new Date(),
            clientId: "dummy-partner-id",
            memberId: memberId,
            memberName: memberName,
            currency: currency,
        },
    };

    return UserModel.findOneAndUpdate({ "local.memberId": memberId }, user, {
        new: true,
        upsert: true,
    });
};

const createUserInfoRecord = async (user) => {
    const userInfo = {
        id: user.id,
        name: user.local.memberName,
        UID: user.local.memberId,
        red: 20000,
        avatarId: 1,
        currency: user.local.currency,
        minBet: 10,
        maxBet: 10000,
    };

    return UserInfoModel.findOneAndUpdate({ id: user.id }, userInfo, {
        new: true,
        upsert: true,
    });
};

const createUserSessionRecord = async (user, currencyCode, currencyGroupId) => {
    const userSession = {
        ssoToken: `${user.local.memberId}-sso-token`,
        sessionId: `${user.local.memberId}-session-id`,
        siteId: "111",
        userId: user.id,
        username: user.local.username,
        owSeq: "1,1,1w",
        memberId: user.local.memberId,
        ssoTime: new Date(),
        recheckInTime: new Date(),
        ip: "192.168.1.1",
        browserUserAgent: "browser-user-agent",
        language: "en-US",
        currencyCode,
        currencyName: user.local.currency,
        currencyGroupId,
        partnerId: user.local.clientId,
        isTestCurrency: false,
        multiplier: 1,
        memberName: user.local.memberName,
        siteName: "site-name",
        system: 1,
    };

    return UserSessionModel.findOneAndUpdate({ userId: user.id }, userSession, {
        new: true,
        upsert: true,
    });
};

const createPartnerConfig = async (partnerId) => {
    const config = {
        partnerId,
        type: "game_site_exclusions",
        value: {
            2: ["test"],
        },
    };

    return PartnerConfigs.create(config);
};

const createCurrencyGroup = async (partnerId) => {
    const currencyGroup = { name: "USD Group", enabled: true, partnerId };
    return CurrencyGroups.create(currencyGroup);
};

const createCurrency = async (groupId) => {
    const currency = {
        name: "$US",
        code: "USD",
        multiplier: 1,
        enabled: true,
        isTest: false,
        partnerId: "dummy-partner-id",
        groupId: groupId,
    };

    return Currencies.create(currency);
};

const createCurrencyGroupGames = async (groupId) => {
    const data = {
        gameId: 2,
        gameName: "xocxoc",
        enabled: true,
        minBet: 1,
        maxBet: 3000,
        maxBetPerChoices: { even: 3000, odd: 3000, red3: 3000, white3: 3000, red4: 1000, white4: 1000, red2: 3000 },
        chips: ["1", "2", "5", "10", "50", "100", "200", "500", "1000", "2000", "3000"],
        stakeLevels: [],
        groupId: groupId,
    };

    return CurrencyGroupGames.findOneAndUpdate(
        {
            gameId: 2,
            enabled: true,
            groupId: groupId,
        },
        data,
        { new: true, upsert: true }
    );
};
