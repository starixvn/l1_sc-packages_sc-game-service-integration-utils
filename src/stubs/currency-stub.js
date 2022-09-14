import { Currencies, CurrencyGroups } from "sc-game-base/src/core/models";

export const createDummyCurrency = async (operatorId, currencyCode = "USD", currencyName = "$US") => {
    const currencyGroup = await createCurrencyGroup(operatorId);
    return createCurrency(currencyGroup._id, operatorId, currencyCode, currencyName);
};

const createCurrencyGroup = async (operatorId) => {
    const currencyGroup = { name: "Dummy Currency Group", enabled: true, operatorId };
    return CurrencyGroups.create(currencyGroup);
};

const createCurrency = async (groupId, operatorId, currencyCode, currencyName) => {
    const currency = {
        name: currencyName,
        code: currencyCode,
        multiplier: 1,
        enabled: true,
        isTest: false,
        groupId: groupId,
        partnerId: operatorId,
        operatorId: operatorId,
    };

    return Currencies.create(currency);
};
