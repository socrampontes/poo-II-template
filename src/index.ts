import express, { Request, Response } from "express";
import cors from "cors";
import { TAccountDB, TAccountDBPost, TUserDB, TUserDBPost } from "./types";
import { db } from "./database/Basedatabse";
import { User } from "./models/User";
import { Account } from "./models/Account";
import { UserDatabase } from "./database/UserDatabase";
import { AccountDatabase } from "./database/AccountDatabase";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;

    const userDatabase = new UserDatabase();

    const usersDB = await userDatabase.findUsers(q);

    const result: User[] = usersDB.map(
      (user) =>
        new User(user.id, user.name, user.email, user.password, user.created_at)
    );

    res.status(200).send(result);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userDatabase = new UserDatabase();
    const userDB = await userDatabase.findUserById(id);

    if (!userDB) {
      res.statusCode = 404;
      throw new Error("user not founf");
    }

    const result: User = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.created_at
    );
    res.status(201).send(result);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;
    const userDatabase = new UserDatabase();
    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'name' deve ser string");
    }

    if (typeof email !== "string") {
      res.status(400);
      throw new Error("'email' deve ser string");
    }

    if (typeof password !== "string") {
      res.status(400);
      throw new Error("'password' deve ser string");
    }

    const userDBExists = await userDatabase.findUserById(id);

    if (userDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    const newUser = new User(
      id,
      name,
      email,
      password,
      new Date().toISOString()
    ); // yyyy-mm-ddThh:mm:sssZ

   
    await userDatabase.createUser(newUser);

    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/accounts", async (req: Request, res: Response) => {
  try {
    const accountsDatabase = new AccountDatabase();

    const accountDB = await accountsDatabase.getAllAccount();

    const accounts: Account[] = accountDB.map(
      (accountDB) =>
        new Account(
          accountDB.id,
          accountDB.balance,
          accountDB.owner_id,
          accountDB.created_at
        )
    );

    res.status(200).send(accounts);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/accounts/:id/balance", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const accountsDatabase = new AccountDatabase();
    const accountDB = await accountsDatabase.findAccountsById(id);

    if (!accountDB) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    const account: Account = new Account(
      accountDB.id,
      accountDB.balance,
      accountDB.owner_id,
      accountDB.created_at
    );

    const balance = account.getBalance();

    res.status(200).send({ balance });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/accounts", async (req: Request, res: Response) => {
  try {
    const accountsDatabase = new AccountDatabase();
    const { id, owner_id, balance } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof owner_id !== "string") {
      res.status(400);
      throw new Error("'ownerId' deve ser string");
    }
    if (typeof balance !== "number") {
      res.statusCode = 400;
      throw new Error("'balance' deve ser um number");
    }

    const accountDBExists = await accountsDatabase.findAccountsById(id);

    if (accountDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }

   /*  const newAccount = new Account(id, 0, ownerId, new Date().toISOString()); */
    const newAccountDB = new Account(
      id,
      balance,
      owner_id,
      new Date().toISOString()
    );

    await accountsDatabase.createAccount(newAccountDB);

    res.status(201).send(newAccountDB);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/accounts/:id/balance", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const value = req.body.value;
    const accountsDatabase = new AccountDatabase();

    if (typeof value !== "number") {
      res.status(400);
      throw new Error("'value' deve ser number");
    }

    const accountDB = await accountsDatabase.findAccountsById(id);
     
    if (!accountDB) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    const account = new Account(
      accountDB.id,
      accountDB.balance,
      accountDB.owner_id,
      accountDB.created_at
    );

    const newBalance = account.getBalance() + value;
    account.setBalance(newBalance);

     accountsDatabase.updateAccount(account) 

    res.status(200).send(account);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
