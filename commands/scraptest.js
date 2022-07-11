const { SlashCommandBuilder } = require("@discordjs/builders");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tips")
        .setDescription("Scrap from website"),
    async execute(interaction) {
        let randomFact;
        let healthArray = [];
        (async () => {
            await interaction.deferReply();
            const browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });

            const page = await browser.newPage();
            await page.goto("https://www.thegoodbody.com/health-facts/");

            //await page.screenshot({ path: "image.png" });

            const pageData = await page.evaluate(() => {
                return {
                    html: document.documentElement.innerHTML,
                };
            });



            const $ = cheerio.load(pageData.html);
            //const element = $()
            $(".round-number")
                .find("h3")
                .each(function (i, el) {
                    let row = $(el).text().replace(/(\s+)/g, " ");
                    row = $(el)
                        .text()
                        .replace(/[0-9]+. /g, "")
                        .trim();

                    healthArray.push(row);
                });

            await browser.close();


            randomFact =
                healthArray[
                    Math.floor(Math.random() * healthArray.length)
                ].toString();

            interaction.channel.send(randomFact);
        })();

        await interaction.reply("Health Fact:");
    },
};
