require('dotenv').config();
const {Telegraf} = require('telegraf');
const CovidAPI = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./consts');
const countryArr = COUNTRIES_LIST.split(', ');

// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Telegraf('1451917654:AAFRZafd8_tW1Y-duwJPaE9DYqaQRTSsWyo');
bot.start((ctx) => {
    ctx.reply(`Привет, ${ctx.message.from.first_name}! 
Это статистика по короновирусу.
Напиши название страны на английском для получения по ней информации.
Посмотреть весь список стран - /help`
    //     Markup.keyboard([
    //     ['US', 'Russia'],
    //     ['Ukraine', 'Israel']
    // ]).resize().extra()
    )
});
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on('sticker', (ctx) => ctx.reply('👍'));

/**
 * Отправка статистики по стране по запросу пользователя
 */
bot.on('text', (ctx) => {
    let data = {};
    data = CovidAPI.getReportsByCountries(ctx.message.text)
        .then(data => {
            let formatData = `
            Страна: ${data[0][0].country},
случаев: ${data[0][0].cases},
смертей: ${data[0][0].deaths},
выздоровело: ${data[0][0].recovered}`;
            let chosenCountries = getRandomCountries(4);
            ctx.reply(formatData, Markup.keyboard([
                [chosenCountries[0], chosenCountries[1]],
                [chosenCountries[2], chosenCountries[3]]
            ]).resize().extra());
        })
        .catch(error => {
            ctx.reply('Нет такой страны, посмотрите /help');
        })
});

/**
 * отправка статистики по случайной стране по таймеру
 */
let intIdx;
// bot.on('text', (ctx) => {
//     if (intIdx) clearInterval(intIdx);
//     intIdx = setInterval(() => {
//         let data = {};
//         let countryArr = COUNTRIES_LIST.split(', ');
//         let chosenCountry = choseCountry(countryArr);
//         data = CovidAPI.getReportsByCountries(chosenCountry)
//             .then(data => {
//                 let formatData = `
//             Страна: ${data[0][0].country},
// случаев: ${data[0][0].cases},
// смертей: ${data[0][0].deaths},
// выздоровело: ${data[0][0].recovered}`;
//                 ctx.reply(formatData);
//             })
//             .catch(error => {
//                 ctx.reply('Нет такой страны, посмотрите /help');
//             })
//     }, 2000);
// });
bot.launch();

/**
 * метод выбора случайной страны
 * @param countryArr - массив стран
 * @returns выбранная страна
 */
function choseCountry(countryArr) {

    const randNum = Math.floor(Math.random()*countryArr.length);

    return countryArr[randNum];
}

function getRandomCountries(amount) {
    let chosenCountryArr = [];
    for (let i = 0; i < amount; i++) {
        let countryName = choseCountry(countryArr);
        countryName = countryName[0].toUpperCase() + countryName.slice(1,);
        chosenCountryArr.push(countryName);
    }
    return chosenCountryArr;
}
