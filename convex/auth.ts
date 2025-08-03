import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { query } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [Password()],
	callbacks: {
		async createOrUpdateUser(ctx, args) {
			console.log("Full args object:", JSON.stringify(args, null, 2));

			// For existing users (sign in), return their existing ID
			if (args.existingUserId) {
				return args.existingUserId;
			}

			// Get the actual subject ID that Convex Auth will use
			// This is available in the context after account creation
			const identity = await ctx.auth.getUserIdentity();
			console.log("User identity in callback:", identity);

			let authSubject;
			if (identity?.subject) {
				// Use the actual subject from the identity
				authSubject = identity.subject;
			} else {
				// Fallback: this shouldn't happen, but just in case
				console.warn("No identity.subject found, using fallback");
				authSubject = `password-${args.profile.email}`;
			}

			const email = args.profile.email as string;

			if (!email) {
				throw new Error("Email is required for user creation");
			}

			console.log(
				"Creating user with authSubject:",
				authSubject,
				"email:",
				email
			);

			const userId = await ctx.db.insert("users", {
				authSubject: authSubject,
				email: email,
				name: "", // Will be filled in complete-profile
				role: "client" as const, // Default role, can be changed in complete-profile
				companyId: undefined,
				companyName: undefined,
				avatar: undefined,
			});

			console.log("Created user with ID:", userId);
			return userId;
		},
	},
});

export const getCurrentSession = query(async (ctx) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) return null;
	return {
		userId: identity.subject,
		email: identity.email,
	};
});
