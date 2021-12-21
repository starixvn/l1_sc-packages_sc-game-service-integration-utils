import nock from "nock";

export const init = (apiUrl) => {
    getBetLimit(apiUrl);
    getBalance(apiUrl);
    placeBet(apiUrl);
    endGame(apiUrl);
};

const getBetLimit = (apiUrl) => {
    nock(apiUrl)
        .post("/Member/GetBetLimit")
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.010 +00:00",
            result: {
                seq: "d8382c1d-6ce0-433d-9233-e7358b10a70b",
                errorCode: 0,
                rrrorDescription: "Success",
                minBet: 0.01,
                maxBet: 3000,
            },
        });
};

const getBalance = (apiUrl) => {
    nock(apiUrl)
        .post("/Member/GetBalance")
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.010 +00:00",
            result: {
                seq: "d8382c1d-6ce0-433d-9233-e7358b10a70b",
                errorCode: 0,
                errorDescription: "Success",
                balance: 25000,
            },
        });
};

const placeBet = (apiUrl) => {
    nock(apiUrl)
        .post("/Member/PlaceBet")
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.010 +00:00",
            result: {
                balance: 24250,
                errorCode: 0,
                errorDescription: "Success",
                obTransId: 1763178465,
                obCustId: "7784514",
                minBet: 1,
                maxBet: 2000,
            },
        });
};

const endGame = (apiUrl) => {
    nock(apiUrl)
        .post("/Member/EndGame")
        .reply(200, {
            timeStamp: "2020/03/19 15:31:00.010 +00:00",
            result: {
                seq: "633b0a18-3cd8-4e59-8c1b-16fc301a5f53",
                obCustId: 7784514,
                errorCode: 0,
                errorDescription: "Success",
            },
        });
};
