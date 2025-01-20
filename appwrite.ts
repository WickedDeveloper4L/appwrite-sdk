import { Account, Client, Databases } from "appwrite";

const clientID = import.meta.env.VITE_SUPABASE_CLIENT_ID;
const client = new Client();
client.setProject(clientID);

export const account = new Account(client);
export const databases = new Databases(client);
