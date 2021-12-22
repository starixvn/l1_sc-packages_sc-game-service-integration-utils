import matches from "lodash.matches";
import nock from "nock";

import { errorUser, normalUser } from "./user-stub";

export const initAPIStub = (apiUrl) => {
    const normalUserRequestBody = { ObCustId: normalUser.memberId };
    const errorUserRequestBody = { ObCustId: errorUser.memberId };
    nock(apiUrl)
        .post("/Member/GetBetLimit", matches(normalUserRequestBody))
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.010 +00:00",
            result: {
                seq: "d8382c1d-6ce0-433d-9233-e7358b10a70b",
                errorCode: 0,
                rrrorDescription: "Success",
                minBet: 0.01,
                maxBet: 3000,
            },
        })
        .post("/Member/Balance", matches(normalUserRequestBody))
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.010 +00:00",
            result: {
                seq: "d8382c1d-6ce0-433d-9233-e7358b10a70b",
                errorCode: 0,
                errorDescription: "Success",
                balance: 25000,
            },
        })
        .post("/Member/PlaceBet", matches(normalUserRequestBody))
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.010 +00:00",
            result: {
                balance: 24250,
                errorCode: 0,
                errorDescription: "Success",
                obTransId: 1763178465,
                obCustId: normalUser.memberId,
                minBet: 1,
                maxBet: 2000,
            },
        })
        .post("/Member/EndGame", matches(normalUserRequestBody))
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.010 +00:00",
            result: {
                seq: "633b0a18-3cd8-4e59-8c1b-16fc301a5f53",
                obCustId: normalUser.memberId,
                errorCode: 0,
                errorDescription: "Success",
            },
        })
        .post("/Member/PlaceBet", matches(errorUserRequestBody))
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.000 +00:00",
            result: {
                seq: "df829722-9826-4540-8a58-1d1c0feada93",
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
            timeStamp: "2020/03/19 15:31:00.000 +00:00",
            result: {
                seq: "633b0a18-3cd8-4e59-8c1b-16fc301a5f53",
                errorCode: 1000,
                errorDescription: "Unspecified Error.",
            },
        });
};
