import { ExchangeRates } from "sc-game-base/src/core/models";

export const createExchangeRate = async () => {
    const exchangeRate = {
        exId: 1,
        source: "Fake",
        code: {
            AUD: 0.74886,
            CAD: 0.80865,
            CNY: 0.15664,
            EUR: 1.16282,
            GBP: 1.37699,
            HKD: 0.12864,
            IDR: 0.07059,
            JPY: 0.0088,
            MYR: 0.24103,
            PHP: 0.01973,
            SGD: 0.74279,
            THB: 0.03023,
            TWD: 0.03589,
            USD: 1,
            VND: 0.00004403,
        },
    };

    return ExchangeRates.create(exchangeRate);
};
