import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

export default convexAuthNextjsMiddleware();

export const config = {
	matcher: [
		// Run middleware on all routes except:
		// - Static assets (e.g., files with extensions like .js, .css, .png)
		// - Next.js internal routes (_next)
		// - Login and register routes
		"/((?!.*\\..*|_next|login|register).*)",
		"/",
		"/(api|trpc)(.*)",
	],
};
