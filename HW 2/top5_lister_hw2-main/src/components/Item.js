import React from "react";

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            index: this.props.index}
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
        //let key = this.props.keyNamePair.key;
        let textValue = this.state.name;
        console.log("Item handleBlur: " + textValue);
        //this.props.renameItemCallback(key, textValue);
        this.handleToggleEdit();
    }

    render() {
        return (
            <div
                id={"item-" + this.props.index+1}
                className={"top5-item"}>
                {this.props.name}
            </div>)
    }
}