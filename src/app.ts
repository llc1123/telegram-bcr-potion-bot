import * as TelegramBot from 'node-telegram-bot-api'
import { program } from 'commander'
import { promises as fs } from 'fs'

const saveChats = async (chatId: number) => {
  chats.push(chatId)
  await fs.appendFile('chats.txt', chatId.toString() + '\n')
}

const loadChats = async (): Promise<number[]> => {
  return fs
    .readFile('chats.txt', 'utf8')
    .then((r: string) => r.split(/\r?\n/))
    .then((r: string[]) => r.filter((item: string) => item !== ''))
    .then((r: string[]) => r.map((item) => parseInt(item)))
}

const startBot = (key: string) => {
  const bot = new TelegramBot(key, { polling: true })

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id
    if (chats.includes(chatId)) {
      bot.sendMessage(chatId, '已经订阅小助手，无法重复订阅。')
      return
    }
    await saveChats(chatId)
    bot.sendMessage(chatId, '小助手订阅成功。')
  })

  reminderLoop(bot)
}

const reminderLoop = (bot: TelegramBot) => {
  const interval = 1000 * 60 * 60 * 6 // 6 hours
  const baseDate = new Date('2020-01-01T00:00:00.000+08:00')

  const nextReminder = () => {
    const now = new Date()
    const until =
      (((baseDate.getTime() - now.getTime()) % interval) + interval) % interval
    setTimeout(() => {
      sendReminder(bot)
      nextReminder()
    }, until)
  }
  nextReminder()
}

const sendReminder = (bot: TelegramBot) => {
  chats.map((chatId) =>
    bot.sendPhoto(chatId, 'https://i.imgur.com/QkinmQn.jpg'),
  )
}

program.option('-k, --key <api_key>', 'telegram bot api key')
program.parse(process.argv)

let APIKey = ''
let chats: number[] = []

if (program.key) {
  APIKey = program.key
}

loadChats()
  .then((r: number[]) => {
    chats = r
    console.log(chats)
  })
  .catch(() => console.log('Chats file not found. No chat ids loaded.'))
  .then(() => startBot(APIKey))
