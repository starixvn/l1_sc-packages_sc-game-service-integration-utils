import { Currencies, CurrencyGroups } from "sc-game-base/src/core/models";

export const createDummyCurrency = async (partnerId, currencyCode = "USD", currencyName = "$US") => {
    const currencyGroup = await createCurrencyGroup(partnerId);
    return createCurrency(currencyGroup._id, partnerId, currencyCode, currencyName);
};

const createCurrencyGroup = async (partnerId) => {
    const currencyGroup = { name: "Dummy Currency Group", enabled: true, partnerId };
    return CurrencyGroups.create(currencyGroup);
};

const createCurrency = async (groupId, partnerId, currencyCode, currencyName) => {
    const currency = {
        name: currencyName,
        code: currencyCode,
        multiplier: 1,
        enabled: true,
        isTest: false,
        partnerId: partnerId,
        groupId: groupId,
    };

    return Currencies.create(currency);
};
