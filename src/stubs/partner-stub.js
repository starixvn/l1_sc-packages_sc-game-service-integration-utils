import { PartnerConfigs } from "sc-game-base/src/core/models";

export const createPartnerConfig = async (gameId, operatorId = "dummy-operator-id") => {
    const partnerConfig = {
        operatorId: operatorId,
        type: "game_site_exclusions",
        value: {
            [gameId]: ["test"],
        },
    };

    return PartnerConfigs.findOneAndUpdate({ operatorId: operatorId }, partnerConfig, { new: true, upsert: true });
};
