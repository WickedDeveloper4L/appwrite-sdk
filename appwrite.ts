import { Account, Client } from "appwrite";

const client = new Client();
client.setProject("678a40280009059d024a");

export const account = new Account(client);
