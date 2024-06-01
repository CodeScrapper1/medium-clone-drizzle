"use server";
import db from "@/db/drizzle";
import { user } from "@/db/schema";
import { getAuthSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getUser = async () => {
  const session: any = await getAuthSession();
  if (!session) {
    return { error: "user not found" };
  }
  let userDetails;
  try {
    userDetails = await db.query.user.findFirst({
      where: eq(user?.email, session?.user.email),
    });
    if (!userDetails) {
      return { error: "user not found" };
    }
  } catch (error) {
    return { error: "user not found" };
  }
  return userDetails;
};

// get user by id
export const getUserById = async (userId: any) => {
  let userDetails;
  try {
    userDetails = await db.query.user.findFirst({
      where: eq(user?.id, userId),
    });
    if (!userDetails) {
      return { error: "user not found" };
    }
  } catch (error) {
    return { error: "user not found" };
  }
  return userDetails;
};
