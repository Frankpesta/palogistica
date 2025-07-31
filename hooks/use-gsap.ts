"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useGSAP() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Initialize GSAP context
		const ctx = gsap.context(() => {
			// Default animations
			gsap.from(".fade-in", {
				opacity: 0,
				duration: 0.6,
				stagger: 0.1,
				ease: "power2.out",
			});

			gsap.from(".slide-up", {
				y: 30,
				opacity: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: "power2.out",
			});

			gsap.from(".scale-in", {
				scale: 0.9,
				opacity: 0,
				duration: 0.6,
				stagger: 0.1,
				ease: "back.out(1.7)",
			});
		}, ref);

		return () => ctx.revert();
	}, []);

	return ref;
}

export function animateStatusChange(element: HTMLElement, newStatus: string) {
	gsap.to(element, {
		scale: 1.05,
		duration: 0.2,
		yoyo: true,
		repeat: 1,
		ease: "power2.inOut",
		onComplete: () => {
			gsap.to(element, {
				backgroundColor: getStatusColor(newStatus),
				duration: 0.3,
				ease: "power2.out",
			});
		},
	});
}

export function animateNotification(element: HTMLElement) {
	gsap.fromTo(
		element,
		{ x: 300, opacity: 0 },
		{ x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
	);
}

function getStatusColor(status: string): string {
	const colors = {
		pending: "#f59e0b",
		confirmed: "#3b82f6",
		in_progress: "#8b5cf6",
		delivered: "#10b981",
		issue_reported: "#ef4444",
	};
	return colors[status as keyof typeof colors] || "#6b7280";
}
