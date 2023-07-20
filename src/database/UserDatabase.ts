import { User } from "../models/User";
import { TUserDB } from "../types";
import { BaseDatabase } from "./Basedatabse";

export class UserDatabase extends BaseDatabase {
  method() {
    UserDatabase.connection();
  }
  async findUsers(q: string): Promise<TUserDB[]> {
    if (q) {
      const result: TUserDB[] = await BaseDatabase.connection("users").where(
        "name",
        "LIKE",
        `%${q}%`
      );
      return result;
    } else {
      const result: TUserDB[] = await BaseDatabase.connection("users");
      return result;
    }
  }

  async findUserById(id: string): Promise<TUserDB | undefined> {
    const [result] = await BaseDatabase.connection("users").where({ id });
    return result;
  }

  async createUser(user: User): Promise<void> {
    await BaseDatabase.connection("users").insert({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      created_at: user.getCreatedAt(),
    });
  }
}
