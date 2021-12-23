import { userInfos as UserInfoModel, users as UserModel, userSessions as UserSessionModel } from "sc-base-database";

export const normalUser = { memberId: 1, memberName: "NormalUser" };

export const errorUser = { memberId: 2, memberName: "ErrorUser" };

export const internalServerErrorUser = { memberId: 3, memberName: "InternalServerErrorUser" };

export const createDummyUsers = async (currency) => {
    await createDummyUser(normalUser.memberId, normalUser.memberName, currency.groupId, currency.code, currency.name);
    await createDummyUser(errorUser.memberId, errorUser.memberName, currency.groupId, currency.code, currency.name);
    await createDummyUser(
        internalServerErrorUser.memberId,
        internalServerErrorUser.memberName,
        currency.groupId,
        currency.code,
        currency.name
    );
};

export const createDummyUser = async (memberId, memberName, currencyGroupId, currencyCode, currencyName) => {
    const user = await createUserRecord(memberId, memberName, currencyName);
    const userInfo = await createUserInfoRecord(user);
    const userSession = await createUserSessionRecord(user, currencyCode, currencyGroupId);

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
            partnerId: partnerId,
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
        partnerId: user.local.partnerId,
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
