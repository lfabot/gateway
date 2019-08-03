import { Amqp } from "@spectacles/brokers";
import { Cluster } from "@spectacles/gateway";
const token: string = process.env.DISCORD_TOKEN;
const cluster = new Cluster(token);
const broker = new Amqp("gateway");
const events = new Set(["GUILD_CREATE", "GUILD_DELETE", "MESSAGE_CREATE", "MESSAGE_DELETE", "GUILD_MEMBER_ADD"]);

async function bootstrap() { // tslint:disable-line
    await broker.connect(process.env.AMQP_URI);
    await cluster.spawn();
    for (const event of events) {
        cluster.on(event, async (data, shard) => {
            await broker.call(event, data);
        });
    }

    cluster.on("connect", () => {
        console.log("Successfully connected to LFABot Gateway.");
    });

    cluster.on("close", () => {
        console.log("LFABot gateway closed by Discord.");

    });
}

bootstrap();
