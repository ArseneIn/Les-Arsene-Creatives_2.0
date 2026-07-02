"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import LoadingScreen from "./LoadingScreen";
import { AnimatePresence } from "framer-motion";

interface GlobalLoaderContextType {
    startLoading: () => void;
    stopLoading: () => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined);

export const useGlobalLoader = () => {
    const context = useContext(GlobalLoaderContext);
    if (!context) {
        throw new Error("useGlobalLoader must be used within a GlobalLoaderProvider");
    }
    return context;
};

function GlobalLoaderInner({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user } = useAuthContext();

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);

    // Identify if the current route/user is a student
    const isStudent = user?.roleId === "student" || pathname.startsWith("/portal/student");

    // Helper to wait for fonts, images, and layout stability
    const waitForResources = () => {
        return new Promise<void>((resolve) => {
            let resolved = false;

            const done = () => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            };

            // Max timeout to prevent getting stuck
            const timeoutId = setTimeout(done, 3000);

            // Wait for web fonts (especially Material Symbols)
            const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();

            // Wait for images
            const checkImages = () => {
                const imgs = Array.from(document.querySelectorAll("img"));
                return Promise.all(
                    imgs.map((img) => {
                        if (img.complete) return Promise.resolve();
                        return new Promise<void>((imgResolve) => {
                            img.addEventListener("load", () => imgResolve(), { once: true });
                            img.addEventListener("error", () => imgResolve(), { once: true });
                            setTimeout(imgResolve, 2000); // safety fallback for individual images
                        });
                    })
                );
            };

            // Wait for DOM stability / paint cycle
            const rafPromise = new Promise<void>((rafResolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setTimeout(rafResolve, 150); // slight buffer for font painting
                    });
                });
            });

            Promise.all([fontPromise, checkImages(), rafPromise]).then(() => {
                clearTimeout(timeoutId);
                done();
            });
        });
    };

    // 1. Initial mount load
    useEffect(() => {
        if (isStudent) {
            setIsInitialLoading(false);
            return;
        }

        waitForResources().then(() => {
            setIsInitialLoading(false);
        });
    }, [isStudent]);

    // 2. Intercept navigation by patching window.history.pushState
    useEffect(() => {
        if (isStudent) return;

        const originalPushState = window.history.pushState;

        window.history.pushState = function (...args) {
            const urlStr = args[2];
            if (urlStr && typeof urlStr === "string") {
                const targetUrl = new URL(urlStr, window.location.origin);
                const currentUrl = new URL(window.location.href);

                // Only trigger if path is different (actual navigation) and not student portal
                if (
                    targetUrl.pathname !== currentUrl.pathname &&
                    targetUrl.pathname.startsWith("/") &&
                    !targetUrl.pathname.startsWith("/portal/student")
                ) {
                    setIsNavigating(true);
                }
            }
            return originalPushState.apply(this, args);
        };

        return () => {
            window.history.pushState = originalPushState;
        };
    }, [isStudent]);

    // 3. Clear navigating state when route actually changes and resources load
    useEffect(() => {
        if (isNavigating) {
            waitForResources().then(() => {
                setIsNavigating(false);
            });
        }
    }, [pathname, searchParams, isNavigating]);

    const startLoading = () => {
        if (!isStudent) {
            setIsNavigating(true);
        }
    };

    const stopLoading = () => {
        setIsNavigating(false);
    };

    const showLoader = !isStudent && (isInitialLoading || isNavigating);

    return (
        <GlobalLoaderContext.Provider value={{ startLoading, stopLoading }}>
            {/* Opaque fullscreen loading screen covering content until fully ready */}
            <AnimatePresence mode="wait">
                {showLoader && (
                    <LoadingScreen key="global-loader" opaque={true} />
                )}
            </AnimatePresence>

            {/* Hide content on initial mount load to prevent flash of unstyled icons */}
            <div
                className="w-full h-full"
                style={{
                    visibility: (isInitialLoading && !isStudent) ? "hidden" : "visible",
                }}
            >
                {children}
            </div>
        </GlobalLoaderContext.Provider>
    );
}

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={null}>
            <GlobalLoaderInner>{children}</GlobalLoaderInner>
        </Suspense>
    );
}
