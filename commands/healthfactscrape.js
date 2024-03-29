const { SlashCommandBuilder } = require("@discordjs/builders");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("healthfact")
        .setDescription("Sends you a random health fact"),
    async execute(interaction) {
        let randomFact;
        // let healthArray = [];
            try {
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
            let $h3 = $('.round-number h3');
            let rnd = Math.floor(Math.random() * $h3.length);
            randomFact = $h3.eq(rnd).text().replace(/[0-9]+\. /g, "").trim();
            //const element = $()
            // $(".round-number")
            //     .find("h3")
            //     .each(function (i, el) {
            //         let row = $(el).text().replace(/(\s+)/g, " ");
            //         row = $(el)
            //             .text()
            //             .replace(/[0-9]+\. /g, "")
            //             .trim();
            //         healthArray.push(row);
            //     });

            await browser.close();
            } catch (e) {
                console.log(e);
            }

            // randomFact =
            //     healthArray[
            //         Math.floor(Math.random() * healthArray.length)
            //     ].toString();
            
                const botLatency = Date.now() - interaction.createdTimestamp;
                const ping = interaction.client.ws.ping;

            const response = new MessageEmbed()
                .setColor("#e31e80")
                .setTitle("Health Fact")
                .setDescription(randomFact)
                .setThumbnail('https://i.imgur.com/tXeiZtM.png')
                .setFields(
                    { name: "Latency🏓", value: `${botLatency}ms`, inline: true },
		            { name: "API Latency🏓", value: `${ping}ms`, inline: true },
                )
    
            //interaction.channel.send({embeds: [response]});
            //interaction.channel.send(randomFact);
            
            //await wait(3000);
            await interaction.editReply({embeds: [response]});
    },
};