// components/WindowControls.js (No change needed here, just confirming structure)
import React from 'react'
import useWindowStore from "#store/window.js";

const WindowControls = ({ target }) => {
    const { closeWindow, minimizeWindow, maximizeWindow } = useWindowStore();
    const windowState = useWindowStore((state) => state.windows[target]);

    if (!windowState) return null;

    return <div id="window-controls">
        <div className="close"
             onClick={() => closeWindow(target) }
        />

        <div className="minimize"
             onClick={() => minimizeWindow(target)}
        />

        {/* The class name changes here, but the click logic remains the same */}
        <div
            className={windowState.isMaximized ? "restore" : "maximize"}
            onClick={() => maximizeWindow(target)}
        />
    </div>
};
export default WindowControls;