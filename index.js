const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')

const token= "5191700110:AAE1Gob7bJNyPfahvRQOQPA7AM1B36sAVj0"

const bot = new TelegramApi(token,{polling:true})

const chats={}



const startGame = async (chatId)=>{
    await bot.sendMessage(chatId,`Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId,'Начинай отгадывать',gameOptions)
}


const start = ()=>{

    bot.setMyCommands([
        {command:'/start',description:'Начальное приветствие'},
        {command:'/info',description:'Получить информацию о пользователе'},
        {command:'/game',description:'Игра угадай число'},
    ])

    bot.on('message',async msg=>{
        const text = msg.text;
        const  chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/b48/7e2/b487e222-21cd-4741-b567-74b25f44b21a/4.webp')
            return  bot.sendMessage(chatId,`Welcome, dude`)
        }
        if( text === '/info'){
            return  bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text==='/game'){
            startGame(chatId)
        }
        return bot.sendMessage(chatId,`Я тебя не понимаю, попробуй еще раз!`)
    })

    bot.on('callback_query',async msg=>{
        const data = msg.data;
        console.log('');
        console.log(msg)
        const chat_id = msg.message.chat.id;

        if(data ==='/again'){
            startGame(chat_id)
        }
        if(''+data === chats[chat_id]){
            return await bot.sendMessage(chat_id,`Поздравляю, ты отгадал цифру ${data}`,againOptions)
        }else{
            return await bot.sendMessage(chat_id,`К сожалению, ты не угадал, бот загадал цифру ${chats[chat_id]}`,againOptions)
        }
    })
}

start()