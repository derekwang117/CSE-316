import React from "react";

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            editActive: false}
    }
    handleClick = (event) => {
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }
    handleUpdate = (event) => {
        this.setState({ name: event.target.value });
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let index = this.props.index;
        let textValue = this.state.name;
        console.log("Item handleBlur: " + textValue);
        this.props.addRenameItemTransactionCallback(index, this.props.name, textValue);
        this.handleToggleEdit();
    }
    handleDragStart = (event) => {
        this.props.dragStartGetter(event.target.id.slice(5) - 1);
    }
    handleDragEnter = (event) => {
        this.props.dragEnterGetter(event);
    }
    handleDragEnd = (event) => {
        this.props.dragEndGetter(event);
    }

    render() {
        if (this.state.editActive) {
            return (
                <div
                    id={"item-" + (this.props.index+1)}
                    className={"top5-item"}
                    onClick={this.handleClick}>
                    <input
                    id={"item-" + (this.props.index+1)}
                    className='list-card'
                    type='input'
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={this.props.name}
                    autoFocus
                    />
                </div>
                )
        }
        else {
            if (this.props.dragActive && this.props.index === this.props.draggedIndex) {
                return (
                    <div
                        id={"item-" + (this.props.index+1)}
                        className={"top5-item-dragged-to"}
                        onClick={this.handleClick}
                        draggable={true}
                        onDragStart={this.handleDragStart}
                        onDragEnter={this.handleDragEnter}
                        onDragEnd={this.handleDragEnd}
                        >
                        {this.props.name}
                    </div>)
            }
            else {
                return (
                    <div
                        id={"item-" + (this.props.index+1)}
                        className={"top5-item"}
                        onClick={this.handleClick}
                        draggable={true}
                        onDragStart={this.handleDragStart}
                        onDragEnter={this.handleDragEnter}
                        onDragEnd={this.handleDragEnd}
                        >
                        {this.props.name}
                    </div>)
            }
        }
    }
}