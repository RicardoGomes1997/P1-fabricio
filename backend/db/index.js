const { MongoClient, ObjectId } = require("mongodb");

let singleton;

async function connect() {
    if (singleton) return singleton;

    const client = new MongoClient(process.env.MONGO_HOST);
    await client.connect();

    singleton = client.db(process.env.MONGO_DATABASE);
    return singleton;
}

const COLLECTION = "eventos";
const ObjectId = require("mongodb").ObjectId;

async function findAllEvents() {
    const db = await connect();
    return db.collection(COLLECTION).find().toArray();
}

async function insert(evento) {
    const db = await connect();
    return db.collection(COLLECTION).insertOne(evento);
}

async function findOne(id) {
    const db = await connect();
    return db.collection(COLLECTION).findOne({_id: new ObjectId(id)});
}

async function update(id, evento) {
    const db = await connect();
    return db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: evento });
}
async function deleteOne(id) {
    const db = await connect();
    return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
    
module.exports = { findAll, insert, findOne, update, deleteOne }