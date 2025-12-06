import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/User.js";

/**
 * Create Inngest client
 */
export const inngest = new Inngest({ id: "1-connectcode" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const data = event.data;

    const newUser = {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address,
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      profileImage: data.image_url,
    };

    // Use upsert so no duplicate errors
    await User.updateOne(
      { clerkId: data.id },
      { $set: newUser },
      { upsert: true }
    );

    return { message: "User synced successfully", user: newUser };
  }
);

/**
 * When Clerk deletes a user → remove from MongoDB
 */
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-DB" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    await User.deleteOne({ clerkId: event.data.id });

    return { message: "User deleted successfully", clerkId: event.data.id };
  }
);

/**
 * Export all Inngest functions
 */
export const functions = [syncUser, deleteUserFromDB];
