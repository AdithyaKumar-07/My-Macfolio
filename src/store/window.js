// store/window.js

import { create } from 'zustand';
import {immer} from "zustand/middleware/immer";
import {INITIAL_Z_INDEX, WINDOW_CONFIG} from "#constants/index.js";

const useWindowStore = create(
    //
    immer((set) => ({
        windows: WINDOW_CONFIG,
        nextZIndex: INITIAL_Z_INDEX + 1,

        openWindow: (windowKey, data=null) =>
            set((state) => {
                const win = state.windows[windowKey];
                if(!win) return;
                win.isOpen = true;
                win.isMaximized = false; // Add new state property
                win.isMinimized = false; // Add new state property
                win.zIndex = state.nextZIndex;
                win.data = data ?? win.data;
                state.nextZIndex++;
            }),

        closeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if(!win) return;
                win.isOpen = false;
                win.isMaximized = false; // Reset on close
                win.isMinimized = false; // Reset on close
                win.zIndex = INITIAL_Z_INDEX;
                win.data = null;
            }),

        focusWindow: (windowKey) =>
            set((state) => {
                if(!state.windows[windowKey]) {
                    console.error(`Could not open window "${windowKey}" in window`);
                    return;
                }
                // When focusing, if minimized, we should restore it.
                const win = state.windows[windowKey];
                win.zIndex = state.nextZIndex++;
                if (win.isMinimized) {
                    win.isMinimized = false;
                }
            }),

        // --- NEW MAXIMIZE/MINIMIZE ACTIONS ---

        maximizeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if(!win) return;
                // If currently maximized, restore it. Otherwise, maximize.
                if (win.isMaximized) {
                    win.isMaximized = false; // Restore
                } else {
                    win.isMaximized = true; // Maximize
                    win.isMinimized = false; // Cannot be both
                    win.zIndex = state.nextZIndex++; // Bring to front
                }
            }),

        minimizeWindow: (windowKey) =>
            set((state) => {
                const win = state.windows[windowKey];
                if(!win) return;
                win.isMinimized = true;
                win.isMaximized = false; // Cannot be both
                // Don't change zIndex here, it will be brought up on focus
            }),

        // NOTE: restoreWindow logic is mostly covered by maximizeWindow (toggling isMaximized)
        // and focusWindow (un-minimizing when clicked).
    })),
);

export default useWindowStore;