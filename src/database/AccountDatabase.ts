import { Account } from "./../models/Account";
import { TAccountDB } from "../types";
import { BaseDatabase } from "./Basedatabse";

export class AccountDatabase extends BaseDatabase {
  async getAllAccount(): Promise<TAccountDB[]> {
    const result: TAccountDB[] = await BaseDatabase.connection("accounts");
    return result;
  }

  async findAccountsById(id: String): Promise<TAccountDB | undefined> {
    const [accountDB]: TAccountDB[] | undefined = await BaseDatabase.connection(
      "accounts"
    ).where({ id: id });
    return accountDB;
  }

  async createAccount(account: Account): Promise<void> {
    await BaseDatabase.connection("accounts").insert({
      id: account.getId(),
      balance: account.getBalance(),
      owner_id: account.getOwnerId(),
      created_at: account.getCreatedAt(),
    });
  }

  async updateAccount(account: Account): Promise<void> {
    await BaseDatabase.connection("accounts").update({ balance: account.getBalance() }).where({id:account.getId()});
  }
}
