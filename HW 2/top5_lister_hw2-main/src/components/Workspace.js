import React from "react";
import Item from "./Item";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            draggedIndex : 0
        }
    }
    dragStartGetter = (index) => {
        //event.dataTransfer.setData("targetId", event.target.id);
        this.setState({
            draggedIndex: index
        })
    }
    dragEnterGetter = (index) => {
        let draggedID = this.state.draggedIndex;
        let droppedID = index;
        this.setState({
            draggedIndex: index
        })
        if (draggedID !== droppedID) {
            this.props.reorderItems(draggedID, droppedID);
        }
    }
    
    render() {
        const { currentList,
                renameItemCallback} = this.props;
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
                                    renameItemCallback={renameItemCallback}
                                    dragStartGetter={this.dragStartGetter}
                                    dragEnterGetter={this.dragEnterGetter}
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