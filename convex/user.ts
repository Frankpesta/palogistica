import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateCompanyId(): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let id = "";
	for (let i = 0; i < 8; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return id;
}

export const completeUserProfile = mutation({
	args: {
		name: v.string(),
		role: v.union(v.literal("client"), v.literal("palogistica")),
		companyName: v.optional(v.string()),
		avatar: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const userIdentity = await ctx.auth.getUserIdentity();

		console.log("User identity in completeUserProfile:", userIdentity);

		// Only require subject, not email (since email might not be in the identity)
		if (!userIdentity?.subject) {
			console.error("Authentication failed:", {
				hasIdentity: !!userIdentity,
				hasSubject: !!userIdentity?.subject,
				hasEmail: !!userIdentity?.email,
				subject: userIdentity?.subject,
				email: userIdentity?.email,
			});
			throw new Error("User must be authenticated to complete profile");
		}

		const authSubject = userIdentity.subject;

		console.log("Looking for user with authSubject:", authSubject);

		// Try to find user by the current authSubject first
		let existingUser = await ctx.db
			.query("users")
			.withIndex("by_auth", (q) => q.eq("authSubject", authSubject))
			.first();

		console.log("Found user by authSubject:", existingUser);

		// If not found by authSubject, we need to find the user created during registration
		// Since we don't have email in the identity, let's look for users with empty names
		// that were created recently
		if (!existingUser) {
			console.log("Not found by authSubject, looking for incomplete profiles");

			// Get all users with empty names (incomplete profiles) and find the most recent one
			// This is a temporary approach - ideally we'd have a better way to link them
			const incompleteUsers = await ctx.db
				.query("users")
				.filter((q) => q.eq(q.field("name"), ""))
				.collect();

			console.log("Found incomplete users:", incompleteUsers.length);

			if (incompleteUsers.length > 0) {
				// Take the most recently created incomplete user
				// Sort by _creationTime descending and take the first one
				existingUser = incompleteUsers.sort(
					(a, b) => b._creationTime - a._creationTime
				)[0];
				console.log("Using most recent incomplete user:", existingUser);

				if (existingUser) {
					// Update the authSubject to match the current session
					console.log(
						"Updating authSubject from",
						existingUser.authSubject,
						"to",
						authSubject
					);
					await ctx.db.patch(existingUser._id, {
						authSubject: authSubject,
					});
				}
			}
		}

		if (!existingUser) {
			throw new Error("User profile not found. Please try registering again.");
		}

		// Check if profile is already completed (has a name)
		if (existingUser.name && existingUser.name.trim() !== "") {
			throw new Error("Profile already completed");
		}

		// Update the incomplete profile with complete information
		await ctx.db.patch(existingUser._id, {
			name: args.name,
			role: args.role,
			companyId: generateCompanyId(),
			companyName: args.companyName || "",
			avatar: args.avatar || "",
		});

		console.log("Profile completed successfully for user:", existingUser._id);
		return { success: true };
	},
});

export const getCurrentUserProfile = query({
	args: {},
	handler: async (ctx) => {
		const userIdentity = await ctx.auth.getUserIdentity();
		console.log("Debug - userIdentity:", userIdentity);

		if (!userIdentity?.subject) {
			console.log("No subject found");
			return null;
		}

		// Get ALL users and log them
		const allUsers = await ctx.db.query("users").collect();
		console.log("All users in database:", allUsers);

		// Just return the first user with a completed profile (for testing)
		const completedUser = allUsers.find((u) => u.name && u.name.trim() !== "");
		console.log("Returning completed user:", completedUser);

		return completedUser || null;
	},
});

// Helper query to check if user profile is incomplete
export const isProfileIncomplete = query({
	args: {},
	handler: async (ctx) => {
		const userIdentity = await ctx.auth.getUserIdentity();
		if (!userIdentity?.subject) return false;

		const user = await ctx.db
			.query("users")
			.withIndex("by_auth", (q) => q.eq("authSubject", userIdentity.subject))
			.first();

		if (!user) return true;

		// Profile is incomplete if name is empty or role is still default
		return !user.name || user.name.trim() === "";
	},
});

export const debugAuth = query({
	args: {},
	handler: async (ctx) => {
		const userIdentity = await ctx.auth.getUserIdentity();
		return {
			isAuthenticated: !!userIdentity,
			identity: userIdentity,
			timestamp: Date.now(),
		};
	},
});
