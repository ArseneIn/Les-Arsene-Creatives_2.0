"use client";

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, Suspense } from "react";
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

    // Track current path and search params to detect when navigation has resolved
    const lastPathname = useRef(pathname);
    const lastSearchParams = useRef(searchParams ? searchParams.toString() : "");

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

    // 2. Intercept clicks on links to show loading screen immediately
    useEffect(() => {
        if (isStudent) return;

        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                anchor.target === "_blank" ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey
            ) {
                return;
            }

            try {
                const url = new URL(href, window.location.origin);
                const currentUrl = new URL(window.location.href);

                if (url.origin !== currentUrl.origin) return;

                if (
                    url.pathname === currentUrl.pathname &&
                    url.search === currentUrl.search &&
                    url.hash !== currentUrl.hash
                ) {
                    return;
                }

                if (url.pathname.startsWith("/portal/student")) return;

                if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
                    return;
                }

                setIsNavigating(true);
            } catch (err) {
                // Ignore invalid URLs
            }
        };

        document.addEventListener("click", handleGlobalClick, { capture: true });
        return () => {
            document.removeEventListener("click", handleGlobalClick, { capture: true });
        };
    }, [isStudent]);

    // 3. Intercept programmatic navigation by patching window.history.pushState and replaceState
    useEffect(() => {
        if (isStudent) return;

        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        const handleNavigationIntercept = (urlStr: string | URL | null | undefined) => {
            if (urlStr && typeof urlStr === "string") {
                const targetUrl = new URL(urlStr, window.location.origin);
                const currentUrl = new URL(window.location.href);

                if (
                    (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) &&
                    targetUrl.pathname.startsWith("/") &&
                    !targetUrl.pathname.startsWith("/portal/student")
                ) {
                    setIsNavigating(true);
                }
            }
        };

        window.history.pushState = function (...args) {
            handleNavigationIntercept(args[2]);
            return originalPushState.apply(this, args);
        };

        window.history.replaceState = function (...args) {
            handleNavigationIntercept(args[2]);
            return originalReplaceState.apply(this, args);
        };

        return () => {
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, [isStudent]);

    // 4. Clear navigating state when route actually changes and resources load
    useEffect(() => {
        const currentPath = pathname;
        const currentSearch = searchParams ? searchParams.toString() : "";
        const pathChanged = currentPath !== lastPathname.current || currentSearch !== lastSearchParams.current;

        if (pathChanged) {
            lastPathname.current = currentPath;
            lastSearchParams.current = currentSearch;

            if (isNavigating) {
                waitForResources().then(() => {
                    setIsNavigating(false);
                });
            }
        }
    }, [pathname, searchParams, isNavigating]);

    // 5. Safety timeout to prevent getting stuck if navigation is cancelled
    useEffect(() => {
        if (isNavigating) {
            const timeoutId = setTimeout(() => {
                setIsNavigating(false);
            }, 6000);
            return () => clearTimeout(timeoutId);
        }
    }, [isNavigating]);

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

            {/* Hide content during initial load or navigation to prevent flash of unstyled content/icons */}
            <div
                className="w-full h-full"
                style={{
                    visibility: ((isInitialLoading || isNavigating) && !isStudent) ? "hidden" : "visible",
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
