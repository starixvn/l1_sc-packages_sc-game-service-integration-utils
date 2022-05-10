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
    const normalUserRequestBody = { ObCustId: normalUser.memberId, PlayerId: normalUser.memberId };
    const errorUserRequestBody = { ObCustId: errorUser.memberId, PlayerId: errorUser.memberId };
    const internalServerErrorUserRequestBody = { ObCustId: internalServerErrorUser.memberId, PlayerId: internalServerErrorUser.memberId };
    const successResult = { errorCode: 0, errorDescription: "Success" };
    const endGameErrorUserRequestBody = { ObCustId: endGameErrorUser.memberId, PlayerId: endGameErrorUser.memberId };

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
                obCustId: normalUser.memberId,
                minBet: 1,
                maxBet: 2000,
                playerId: normalUser.memberId,
            },
        })
        .post(actions.endGame, matches(normalUserRequestBody))
        .reply(200, {
            result: {
                obCustId: normalUser.memberId,
                playerId: normalUser.memberId,
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
                obCustId: endGameErrorUser.memberId,
                playerId: endGameErrorUser.memberId,
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
