import { userInfos as UserInfoModel, users as UserModel, userSessions as UserSessionModel } from "sc-base-database";

export const normalUser = { playerId: 1, playerName: "NormalUser" };

export const errorUser = { playerId: 2, playerName: "ErrorUser" };

export const internalServerErrorUser = { playerId: 3, playerName: "InternalServerErrorUser" };

export const endGameErrorUser = { playerId: 4, playerName: "EndGameErrorUser" };

export const botUser1 = { playerId: 5, playerName: "Bot1" };

export const botUser2 = { playerId: 6, playerName: "Bot2" };

export const createDummyUsers = async (currency) => {
    await createDummyUser(normalUser.playerId, normalUser.playerName, currency);
    await createDummyUser(errorUser.playerId, errorUser.playerName, currency);
    await createDummyUser(internalServerErrorUser.playerId, internalServerErrorUser.playerName, currency);
    await createDummyUser(endGameErrorUser.playerId, endGameErrorUser.playerName, currency);
    await createDummyUser(botUser1.playerId, botUser1.playerName, currency, true);
    await createDummyUser(botUser2.playerId, botUser2.playerName, currency, true);
};

export const createDummyUser = async (playerId, playerName, currency, isBot = false) => {
    const user = await createUserRecord(playerId, playerName, currency.operatorId, currency.name);
    const userInfo = await createUserInfoRecord(user, isBot);
    const userSession = await createUserSessionRecord(user, currency.code, currency.groupId);

    return {
        user,
        userInfo,
        userSession,
    };
};

const createUserRecord = async (playerId, playerName, operatorId, currencyName) => {
    const user = {
        local: {
            username: `${playerId}_${playerName}`,
            password: "dummy-password",
            lastDate: new Date(),
            lastLogin: new Date(),
            regDate: new Date(),
            currency: currencyName,
            operatorId: operatorId,
            playerId: playerId,
            playerName: playerName,
        },
    };

    return UserModel.findOneAndUpdate({ "local.playerId": playerId }, user, {
        new: true,
        upsert: true,
    });
};

const createUserInfoRecord = async (user, isBot) => {
    const userInfo = {
        id: user.id,
        name: user.local.playerName,
        UID: user.local.playerId,
        red: 20000,
        avatarId: 1,
        currency: user.local.currency,
        minBet: 10,
        maxBet: 10000,
        type: isBot,
        inRoom: false,
        disabled: false,
        banned: false,
    };

    return UserInfoModel.findOneAndUpdate({ id: user.id }, userInfo, {
        new: true,
        upsert: true,
    });
};

const createUserSessionRecord = async (user, currencyCode, currencyGroupId) => {
    const userSession = {
        ssoToken: `${user.local.playerId}-sso-token`,
        sessionId: `${user.local.playerId}-session-id`,
        siteId: "111",
        userId: user.id,
        username: user.local.username,
        owSeq: "1,1,1w",
        ssoTime: new Date(),
        recheckInTime: new Date(),
        ip: "192.168.1.1",
        browserUserAgent: "browser-user-agent",
        language: "en-US",
        currencyCode,
        currencyName: user.local.currency,
        currencyGroupId,
        isTestCurrency: false,
        multiplier: 1,
        siteName: "site-name",
        system: 1,
        operatorId: user.local.operatorId,
        playerId: user.local.playerId,
        playerName: user.local.playerName,
    };

    return UserSessionModel.findOneAndUpdate({ userId: user.id }, userSession, {
        new: true,
        upsert: true,
    });
};
