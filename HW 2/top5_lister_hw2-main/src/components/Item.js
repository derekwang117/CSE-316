import React from "react";

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            index: this.props.index,
            editActive: false}
    }
    handleClick = (event) => {
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    /*handleLoadItem = (event) => {
        let itemKey = event.target.id;
        if (listKey.startsWith("list-card-text-")) {
            listKey = listKey.substring("list-card-text-".length);
        }
        this.props.loadListCallback(listKey);
    }*/
    /*handleDeleteList = (event) => {
        event.stopPropagation();
        this.props.deleteListCallback(this.props.keyNamePair);
    }*/
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
        let index = this.state.index;
        let textValue = this.state.name;
        console.log("Item handleBlur: " + textValue);
        this.props.renameItemCallback(index, textValue);
        this.handleToggleEdit();
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
            return (
                <div
                    id={"item-" + (this.props.index+1)}
                    className={"top5-item"}
                    onClick={this.handleClick}>
                    {this.props.name}
                </div>)
        }
    }
}