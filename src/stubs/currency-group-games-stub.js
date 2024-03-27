import { CurrencyGroupGames } from "sc-base-database";

export const createCurrencyGroupGames = async (currencyGroupId, gameId, gameConfig) => {
    const data = {
        enabled: true,
        chips: ["1", "2", "5", "10", "50", "100", "200", "500", "1000", "2000", "3000"],
        stakeLevels: [],
        groupId: currencyGroupId,
    };

    return CurrencyGroupGames.create({ gameId, ...gameConfig, ...data });
};
