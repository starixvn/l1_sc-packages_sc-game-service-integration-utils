import { userInfos as UserInfoModel, users as UserModel, userSessions as UserSessionModel } from "sc-base-database";

export const normalUser = { memberId: 1, memberName: "NormalUser" };

export const errorUser = { memberId: 2, memberName: "ErrorUser" };

export const internalServerErrorUser = { memberId: 3, memberName: "InternalServerErrorUser" };

export const endGameErrorUser = { memberId: 4, memberName: "EndGameErrorUser" };

export const botUser1 = { memberId: 5, memberName: "Bot1" };

export const botUser2 = { memberId: 6, memberName: "Bot2" };

export const createDummyUsers = async (currency) => {
    await createDummyUser(normalUser.memberId, normalUser.memberName, currency);
    await createDummyUser(errorUser.memberId, errorUser.memberName, currency);
    await createDummyUser(internalServerErrorUser.memberId, internalServerErrorUser.memberName, currency);
    await createDummyUser(endGameErrorUser.memberId, endGameErrorUser.memberName, currency);
    await createDummyUser(botUser1.memberId, botUser1.memberName, currency, true);
    await createDummyUser(botUser2.memberId, botUser2.memberName, currency, true);
};

export const createDummyUser = async (memberId, memberName, currency, isBot = false) => {
    const user = await createUserRecord(memberId, memberName, currency.partnerId, currency.name);
    const userInfo = await createUserInfoRecord(user, isBot);
    const userSession = await createUserSessionRecord(user, currency.code, currency.groupId);

    return {
        user,
        userInfo,
        userSession,
    };
};

const createUserRecord = async (memberId, memberName, partnerId, currencyName) => {
    const user = {
        local: {
            username: `${memberId}_${memberName}`,
            password: "dummy-password",
            lastDate: new Date(),
            lastLogin: new Date(),
            regDate: new Date(),
            partnerId: partnerId,
            memberId: memberId,
            memberName: memberName,
            currency: currencyName,
            operatorId: partnerId,
            playerId: memberId,
            playerName: memberName,
        },
    };

    return UserModel.findOneAndUpdate({ "local.memberId": memberId }, user, {
        new: true,
        upsert: true,
    });
};

const createUserInfoRecord = async (user, isBot) => {
    const userInfo = {
        id: user.id,
        name: user.local.memberName,
        UID: user.local.memberId,
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
        partnerId: user.local.partnerId,
        isTestCurrency: false,
        multiplier: 1,
        memberName: user.local.memberName,
        siteName: "site-name",
        system: 1,
        operatorId: user.local.partnerId,
        playerId: user.local.memberId,
        playerName: user.local.memberName,
    };

    return UserSessionModel.findOneAndUpdate({ userId: user.id }, userSession, {
        new: true,
        upsert: true,
    });
};
