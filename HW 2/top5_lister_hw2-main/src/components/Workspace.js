import React from "react";
import Item from "./Item";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            draggerIndex : null,
            draggedIndex : null,
            dragActive : false
        }
    }
    dragStartGetter = (index) => {
        this.setState({
            draggerIndex: index,
            draggedIndex: index,
            dragActive: true
        })
    }
    dragEnterGetter = (event) => {
        let index = event.target.id.slice(5) - 1
        let draggedIndex = this.state.draggedIndex;
        let droppedIndex = index;
        this.setState({
            draggedIndex: index,
            dragActive: true
        })
        if (draggedIndex !== droppedIndex) {
            this.props.reorderItemsCallback(draggedIndex, droppedIndex);
        }
    }
    dragEndGetter = (event) => {
        this.setState(prevState => ({
            draggedIndex: prevState.draggedIndex,
            dragActive: false
        }))
        this.props.reorderItemsCallback(this.state.draggedIndex, this.state.draggerIndex);
        this.props.addReorderItemsTransactionCallback(this.state.draggerIndex, this.state.draggedIndex);
        this.props.saveItemsCallback();
    }
    render() {
        const { currentList,
            addRenameItemTransactionCallback} = this.props;
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
                                    addRenameItemTransactionCallback={addRenameItemTransactionCallback}
                                    dragStartGetter={this.dragStartGetter}
                                    dragEnterGetter={this.dragEnterGetter}
                                    draggedIndex={this.state.draggedIndex}
                                    dragEndGetter={this.dragEndGetter}
                                    dragActive={this.state.dragActive}
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