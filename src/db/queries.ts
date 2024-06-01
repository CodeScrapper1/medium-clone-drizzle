import { cache } from "react";
import db from "./drizzle";
import { users } from "./schema";
import { eq, ne } from "drizzle-orm";

export const getUsers = cache(async () => {
  // const user = await db.query.users.findFirst({
  //   // where: eq(users.id, "ef"),
  //   where: (model, { eq }) => eq(model.id, "ef"),
  //   with: {
  //     stories: {
  //       with: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });
  // return user;
  // return await db.select().from(users);
  // return await db.select().from(users).where(ne(users.id, "ab"));
  // return await db.select().from(users).where(eq(users.id, "ef"));
});
