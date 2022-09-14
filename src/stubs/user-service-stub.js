import matches from "lodash.matches";
import nock from "nock";
import { normalUser, errorUser, internalServerErrorUser, endGameErrorUser } from "./user-stub";
import { userSessions as UserSessionModel } from "sc-base-database";

const actions = {
    signInGame: "/gameBackend/signInGame",
};

const defaultUsers = [normalUser, errorUser, internalServerErrorUser, endGameErrorUser];

export const stubUserService = async (appConfigs, users = null) => {
    const matchedUsers = users || defaultUsers;

    await Promise.all(
        matchedUsers.map(async (user) => {
            const userSession = await UserSessionModel.findOne({ sessionId: `${user.playerId}-session-id` })
                .lean()
                .exec();

            const params = {
                session: userSession.sessionId,
                username: userSession.username,
                browserUserAgent: userSession.browserUserAgent,
            };

            nock(appConfigs.userServiceSettings.url)
                .persist()
                .post(actions.signInGame, matches(params), () => true)
                .reply(200, { ...userSession, id: userSession.userId });
        })
    );
};
