import { MongoClient } from "mongodb";
import config from '../config';

const client = await new MongoClient(config.MONGODB_URI).connect();

export default client;