import matches from "lodash.matches";
import nock from "nock";

import { errorUser, normalUser } from "./user-stub";

export const initAPIStub = (apiUrl) => {
    const normalUserRequestBody = { ObCustId: normalUser.memberId };
    const errorUserRequestBody = { ObCustId: errorUser.memberId };
    const successResult = { errorCode: 0, errorDescription: "Success" };

    nock(apiUrl)
        .post("/Member/GetBetLimit", matches(normalUserRequestBody))
        .reply(200, {
            result: {
                ...successResult,
                minBet: 0.01,
                maxBet: 3000,
            },
        })
        .post("/Member/Balance", matches(normalUserRequestBody))
        .reply(200, {
            result: {
                ...successResult,
                balance: 25000,
            },
        })
        .post("/Member/PlaceBet", matches(normalUserRequestBody))
        .reply(200, {
            result: {
                balance: 24250,
                ...successResult,
                obTransId: 1763178465,
                obCustId: normalUser.memberId,
                minBet: 1,
                maxBet: 2000,
            },
        })
        .post("/Member/EndGame", matches(normalUserRequestBody))
        .reply(200, {
            result: {
                obCustId: normalUser.memberId,
                ...successResult,
            },
        })
        .post("/Member/PlaceBet", matches(errorUserRequestBody))
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
        .post("/Member/EndGame", matches(errorUserRequestBody))
        .reply(200, {
            result: {
                errorCode: 1000,
                errorDescription: "Unspecified Error.",
            },
        });
};
