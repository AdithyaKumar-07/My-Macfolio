// WindowWrapper.jsx
import React, {useLayoutEffect, useRef} from 'react'
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import useWindowStore from "#store/window.js";

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        // 1. Destructure the new state properties: isMaximized, isMinimized
        const { isOpen, zIndex, isMaximized, isMinimized } = windows[windowKey];
        const ref = useRef(null);

        // 2. Define the dynamic class names
        const windowClasses = [
            "absolute", // Keep this for positioning
            "window-frame", // A base class for styling (Crucial for CSS in Step 2)
            isMaximized ? "is-maximized" : "",
            isMinimized ? "is-minimized" : "",
        ].join(' ').trim();

        useGSAP(() => {
            const el = ref.current;
            if(!el || !isOpen) return;

            // When opening, if it's maximized, skip the fancy animation
            if (isMaximized) return;

            // Use 'block' display only if we are restoring from minimized or opening fresh
            el.style.display = "block";

            gsap.fromTo(el,
                { scale: 0.8, opacity: 0, y: 40 },
                {scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        }, [isOpen]);

        useGSAP(() => {
            const el = ref.current;
            if(!el) return;

            const [instance] = Draggable.create(el, {
                onPress: () => focusWindow(windowKey),
                // Disable dragging when maximized
                // This ensures the window cannot be dragged when it covers the full screen
                dragClickables: true,
                bounds: document.body,
                disabled: isMaximized // Disable if maximized!
            });

            return () => instance.kill();
        }, [isMaximized]); // Rerun Draggable setup when maximization state changes

        useLayoutEffect(() => {
            const el = ref.current;
            if(!el) return;

            // Hide the window only if it's closed OR minimized
            // If it's maximized, it should still be 'block'
            el.style.display = (isOpen && !isMinimized) ? 'block' : 'none';
        }, [isOpen, isMinimized]);

        return (
            // 3. Apply the dynamic windowClasses
            <section
                id={ windowKey }
                ref={ ref }
                style={{ zIndex }}
                className={ windowClasses } // Use the calculated classes
            >
                <Component { ...props } />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${ Component.displayName || Component.name || "Component" })`;

    return Wrapped;
};

export default WindowWrapper;