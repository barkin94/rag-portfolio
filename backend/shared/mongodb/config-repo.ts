import client from './client';
import config from '../config';

const db = client.db(config.MONGODB_DBNAME);
const configColl = db.collection("config");

export async function isInMaintenance(): Promise<boolean> {
  const doc = await configColl.findOne({ key: "maintenance" });
  return doc?.value === true;
}

export async function setMaintenanceMode(enabled: boolean): Promise<void> {
  await configColl.updateOne(
    { key: "maintenance" },
    { $set: { value: enabled, updatedAt: new Date() } },
    { upsert: true }
  );
}