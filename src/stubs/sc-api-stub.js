import matches from "lodash.matches";
import nock from "nock";

import { endGameErrorUser, errorUser, internalServerErrorUser, normalUser } from "./user-stub";

const actions = {
    getBetLimit: "/Player/GetBetLimit",
    getBalance: "/Player/Balance",
    placeBet: "/Player/PlaceBet",
    endGame: "/Player/EndGame",
};

export const initAPIStub = (apiUrl) => {
    const normalUserRequestBody = { PlayerId: normalUser.playerId };
    const errorUserRequestBody = { PlayerId: errorUser.playerId };
    const internalServerErrorUserRequestBody = { PlayerId: internalServerErrorUser.playerId };
    const successResult = { errorCode: 0, errorDescription: "Success" };
    const endGameErrorUserRequestBody = { PlayerId: endGameErrorUser.playerId };

    nock(apiUrl)
        .persist()
        .post(actions.getBetLimit, matches(normalUserRequestBody))
        .reply(200, {
            result: {
                ...successResult,
                minBet: 0.01,
                maxBet: 3000,
            },
        })
        .post(actions.getBalance, matches(normalUserRequestBody))
        .reply(200, {
            result: {
                ...successResult,
                balance: 25000,
            },
        })
        .post(actions.placeBet, matches(normalUserRequestBody))
        .reply(200, {
            result: {
                balance: 24250,
                ...successResult,
                obTransId: 1763178465,
                minBet: 1,
                maxBet: 2000,
                playerId: normalUser.playerId,
            },
        })
        .post(actions.endGame, matches(normalUserRequestBody))
        .reply(200, {
            result: {
                playerId: normalUser.playerId,
                ...successResult,
            },
        })
        .post(actions.placeBet, matches(errorUserRequestBody))
        .reply(200, {
            result: {
                balance: 0.0,
                obTransId: null,
                errorCode: 3002,
                errorDescription: "Player has insufficient funds.",
                minBet: 0,
                maxBet: 0,
            },
        })
        .post(actions.placeBet, matches(endGameErrorUserRequestBody))
        .reply(200, {
            result: {
                balance: 24250,
                ...successResult,
                obTransId: 1763178465,
                playerId: endGameErrorUser.playerId,
                minBet: 1,
                maxBet: 2000,
            },
        })
        .post(actions.endGame, matches(endGameErrorUserRequestBody))
        .reply(200, {
            result: {
                errorCode: 1000,
                errorDescription: "Unspecified Error.",
            },
        })
        .post(actions.placeBet, matches(internalServerErrorUserRequestBody))
        .reply(500);
};
