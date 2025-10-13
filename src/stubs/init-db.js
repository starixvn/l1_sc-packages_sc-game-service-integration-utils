import { init } from "sc-base-database";

export const initDB = async (configs) => {
    console.log("Initializing database for integration tests");
    return init(configs);
}