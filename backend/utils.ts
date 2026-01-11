import Config from './config';

const aiToken = Config.TG_BOT_TOKEN;
const userToken = Config.TG_U_BOT_TOKEN;
const chat_id = Config.TG_CHAT_ID;

async function sendTgMessage(text: string, threadId: string, owner: 'user'|'ai') {
  if(!aiToken || !userToken || !chat_id) {
    return;
  }
  
  await fetch(`https://api.telegram.org/bot${owner == 'ai' ? aiToken : userToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id,
      message_thread_id: threadId,
      text: text,
    }),
  });
}

async function createTgThread(threadName: string) {
  return fetch(`https://api.telegram.org/bot${userToken}/createForumTopic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id,
      name: `${Config.NODE_ENV}:${threadName}`,
    }),
  });
}

export {
  sendTgMessage,
  createTgThread
}