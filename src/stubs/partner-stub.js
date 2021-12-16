import { PartnerConfigs, CurrencyGroups, Currencies, CurrencyGroupGames } from "sc-game-base/src/core/models";

export const createDummyPartner = async (partnerId) => {
    await createPartnerConfig(partnerId);
    const currencyGroup = await createCurrencyGroup(partnerId);
    await createCurrency(currencyGroup._id);
    await createCurrencyGroupGames(currencyGroup._id);
};

const createPartnerConfig = async (partnerId) => {
    const config = {
        partnerId,
        type: "game_site_exclusions",
        value: {
            2: ["test"],
        },
    };

    return PartnerConfigs.create(config);
};

const createCurrencyGroup = async (partnerId) => {
    const currencyGroup = { name: "USD Group", enabled: true, partnerId };
    return CurrencyGroups.create(currencyGroup);
};

const createCurrency = async (groupId) => {
    const currency = {
        name: "$US",
        code: "USD",
        multiplier: 1,
        enabled: true,
        isTest: false,
        partnerId: "dummy-partner-id",
        groupId: groupId,
    };

    return Currencies.create(currency);
};

const createCurrencyGroupGames = async (groupId) => {
    const data = {
        gameId: 2,
        gameName: "xocxoc",
        enabled: true,
        minBet: 1,
        maxBet: 3000,
        maxBetPerChoices: { even: 3000, odd: 3000, red3: 3000, white3: 3000, red4: 1000, white4: 1000, red2: 3000 },
        chips: ["1", "2", "5", "10", "50", "100", "200", "500", "1000", "2000", "3000"],
        stakeLevels: [],
        groupId: groupId,
    };

    return CurrencyGroupGames.findOneAndUpdate(
        {
            gameId: 2,
            enabled: true,
            groupId: groupId,
        },
        data,
        { new: true, upsert: true }
    );
};
