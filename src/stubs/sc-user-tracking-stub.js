import nock from "nock";

export const stubUserTrackingService = (appConfigs) => {
    nock(appConfigs.trackingApiSettings.baseUrl)
        .persist()
        .post('/game/sign-in')
        .reply(200, {});

    nock(appConfigs.trackingApiSettings.baseUrl)
        .persist()
        .post('/game/sign-out')
        .reply(200, {});
}