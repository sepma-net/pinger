import { existsSync } from "https://deno.land/std@0.99.0/fs/mod.ts";
import logger from "./logger.ts";

logger.setLevel(Number(Deno.env.get("LOG_LEVEL")) ?? 1)

if (!existsSync("./data")) Deno.mkdir("./data");

const DOMAINS = ["sepma.net", "dev.sepma.net"]

const lastStatuses = new Map<string, { online: boolean, lastChange: number }>()
await loadLastStautses(DOMAINS);

setInterval(ping, 1000 * 10, DOMAINS);

function ping(domains: string[]) {
    domains.forEach(async domain => {
        logger.info(`[PING] fetching ${domain}`)
        const online = await fetch(`https://${domain}`).then(res => res.ok)
        const last = lastStatuses.get(domain);
        logger.info(`[PING] fetched ${domain} online: ${online}, last: ${last?.online}`)
        if (last?.online === online) return;

        lastStatuses.set(domain, { online, lastChange: Date.now() })
        await writeFile(domain, online)
        await sendMessage(domain, online, last?.lastChange ?? Date.now())
    })

}

async function sendMessage(domain: string, online: boolean, lastChange: number) {
    console.log({ domain, online, lastChange })
    const embed = {
        title: online ? `[INFO] ${domain} is UP!` : `[ERROR] ${domain} is Down!`,
        color: online ? 65280 : 16711680,
        fields: [
            {
                name: online ? "Online" : "Offline",
                value: `${domain} is ${online ? "Online" : "Offline"} since\n ${new Date()}`,
            },
            {
                name: `Last ${online ? "Offline" : "Online"} Time`,
                value: `${(Date.now() - lastChange) / 1000 / 60} Minutes`,
            },
        ],
    }
    const res = await fetch(`https://discord.com/api/v9/webhooks/${Deno.env.get("WEBHOOK_ID")}/${Deno.env.get("WEBHOOK_TOKEN")}`, {
        headers: {
            "content-type": "application/json"
        }, method: "POST", body: JSON.stringify({
            username: "Sepma Ping!",
            avatar_url: "https://sepma.net/pics/Sepma.gif",
            embed,
        })
    }).then(res => res.json);
    logger.info(res)
}

async function loadLastStautses(domains: string[]) {
    const results = await Promise.all(
        domains.map(async domain => {
            const data = await getTextFile(domain)

            if (!data) {
                await writeFile(domain, true)
            }

            return [domain, (data?.online ?? "true") === "true" ? true : false, data?.lastChange] as [string, boolean, number]
        })
    )

    for (const [domain, online, lastChange] of results) {
        lastStatuses.set(domain, { online, lastChange })
    }
}

async function writeFile(domain: string, online: boolean, lastChange = Date.now()) {
    return await Deno.writeTextFile(`./data/${domain}`, `${online},${lastChange}`)
}

async function getTextFile(domain: string) {
    if (!existsSync(`./data/${domain}`)) return;
    const data = await Deno.readTextFile(`./data/${domain}`)
    logger.debug("Data: " + data)

    const [online, lastChange] = data.split(",");

    return { online, lastChange: Number(lastChange) }
}
