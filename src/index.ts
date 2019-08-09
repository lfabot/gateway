import { Amqp } from "@spectacles/brokers";
import { Cluster } from "@spectacles/gateway";
const token: string = process.env.DISCORD_TOKEN;
const cluster = new Cluster(token);
const broker = new Amqp("gateway");

(async () => {
    await broker.connect(process.env.AMQP_URI);
    await cluster.spawn();

    cluster
        .on("connect", () => console.log("Successfully connected to LFABot Gateway."))
        .on("close", () => console.log("LFABot gateway closed by Discord."))

        // Handle Discord Events
        .on("GUILD_CREATE", async data => {
            // TODO: Cache Guild
        })
        .on("MESSAGE_UPDATE", async data => {
            // TODO: Handle Message Updates
        })
        .on("MESSAGE_CREATE", async data => broker.call("MESSAGE_CREATE", data));
})();
