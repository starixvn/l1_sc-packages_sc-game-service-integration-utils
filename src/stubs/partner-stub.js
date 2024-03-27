import { PartnerConfigs } from "sc-base-database";

export const createPartnerConfig = async (gameId, operatorId = "dummy-operator-id") => {
    const partnerConfig = {
        partnerId: operatorId,
        type: "game_site_exclusions",
        value: {
            [gameId]: ["test"],
        },
    };

    return PartnerConfigs.findOneAndUpdate({ partnerId: operatorId }, partnerConfig, { new: true, upsert: true });
};
