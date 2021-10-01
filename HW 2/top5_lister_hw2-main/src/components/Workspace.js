import React from "react";
import Item from "./Item";

export default class Workspace extends React.Component {
    render() {
        const { currentList /*,
        renameItemCallback*/} = this.props;

        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items">
                    {
                        currentList
                            ? currentList.items.map((name, index) => (
                                <Item
                                    name={name}
                                    index={index}
                                    key={index}
                                    //renameListCallback={renameListCallback}
                                />
                                ))
                            : null
                    }
                    </div>
                </div>
            </div>
        )
    }
}