import matches from "lodash.matches";
import nock from "nock";
import { normalUser, errorUser, internalServerErrorUser, endGameErrorUser } from "./user-stub";
import { userInfos as UserInfoModel, userSessions as UserSessionModel } from "sc-base-database";

const actions = {
    verifySession: "/auth/session/verify",
    signInGame: "/users/signInGame",
};

const defaultUsers = [normalUser, errorUser, internalServerErrorUser, endGameErrorUser];

export const stubUserService = async (appConfigs, users = null) => {
    const matchedUsers = users || defaultUsers;
    const requestConfigs = { timeout: appConfigs.userServiceSettings.requestTimeout };
    await Promise.all(
        matchedUsers.map(async (user) => {
            const userSession = await UserSessionModel.findOne({ sessionId: `${user.memberId}-session-id` })
                .lean()
                .exec();

            const userInfo = await UserInfoModel.findOne({ id: userSession.userId }).lean().exec();

            const params = {
                session: userSession.sessionId,
                username: userSession.username,
                browserUserAgent: userSession.browserUserAgent,
            };

            const result = {
                isSuccessful: true,
                user: userInfo,
                userSession,
            };

            nock(appConfigs.userServiceSettings.url)
                .persist()
                .post(actions.verifySession, matches(params), matches(requestConfigs))
                .reply(200, result);

            nock(appConfigs.userServiceSettings.url)
                .persist()
                .post(actions.signInGame, matches(params), () => true)
                .reply(200, result);
        })
    );
};
