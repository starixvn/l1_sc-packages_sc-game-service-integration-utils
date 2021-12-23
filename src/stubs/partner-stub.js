import { PartnerConfigs } from "sc-game-base/src/core/models";

export const createPartnerConfig = async (gameId, partnerId = "dummy-partner-id") => {
    const partnerConfig = {
        partnerId: partnerId,
        type: "game_site_exclusions",
        value: {
            [gameId]: ["test"],
        },
    };

    return PartnerConfigs.findOneAndUpdate({ partnerId: partnerId }, partnerConfig, { new: true, upsert: true });
};
