// import { Dexie } from "dexie"

// const db = new Dexie("EmpreGoDB");

// db.version(1).stores({
//   mensagens: "id, chatId, timestamp"
// });

// async function salvarMensagem(msg) {
//   await db.mensagens.put(msg);
// }

// async function carregarChat(chatId) {
//   return await db.mensagens
//     .where("chatId")
//     .equals(chatId)
//     .sortBy("timestamp");
// }

// * Pego pela DOC: https://dexie.org/docs/Tutorial/React
// import { Dexie, type EntityTable } from "dexie"

// interface Friend {
//   id: number
//   name: string
//   age: number
// }

// const db = new Dexie("FriendsDatabase") as Dexie & {
//   friends: EntityTable<
//     Friend,
//     "id" // primary key "id" (for the typings only)
//   >
// }

// // Schema declaration:
// db.version(1).stores({
//   friends: "++id, name, age", // primary key "id" (for the runtime!)
// })

// export type { Friend }
// export { db }