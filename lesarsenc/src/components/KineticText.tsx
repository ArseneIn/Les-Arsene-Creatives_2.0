"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function KineticText({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <span ref={ref} className={className}>
            <span className="sr-only">{children}</span>
            <span aria-hidden="true" className="block overflow-hidden">
                {children.split(" ").map((word, index) => (
                    <span key={index} className="inline-block mr-[0.25em] overflow-hidden">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={isInView ? { y: 0 } : {}}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.05,
                                ease: [0.33, 1, 0.68, 1],
                            }}
                            className="inline-block"
                        >
                            {word}
                        </motion.span>
                    </span>
                ))}
            </span>
        </span>
    );
}
