import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { undoCallback,
                redoCallback,
                closeCallback,
                canUndo,
                canRedo,
                currentList
        } = this.props
        return (
            <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    className={canUndo ? "top5-button" : "top5-button-disabled"}
                    onClick={undoCallback}>
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className={canRedo ? "top5-button" : "top5-button-disabled"}
                    onClick={redoCallback}>
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    className={currentList ? "top5-button" : "top5-button-disabled"}
                    onClick={closeCallback}>
                        &#x24E7;
                </div>
            </div>
        )
    }
}