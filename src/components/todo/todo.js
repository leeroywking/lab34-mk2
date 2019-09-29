import React from "react";
import uuid from "uuid/v4";
import Counter from "../counter/counter.js";
import { When, If } from "../if";
import Auth from "../auth/auth.js";
import { LoginContext } from "../auth/context.js";

import "./todo.scss";

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { todoList: [], item: {}, editing: false };
  }
  static contextType = LoginContext;

  handleInputChange = e => {
    let item = {
      text: e.target.value,
      complete: !!e.target.complete,
      id: e.target.id || uuid()
    };
    this.setState({ item });
  };

  addItem = e => {
    e.preventDefault();
    e.target.reset();
    this.setState({ todoList: [...this.state.todoList, this.state.item] });
  };

  updateItem = e => {
    e.preventDefault();
    this.saveItem(this.state.item);
  };

  toggleComplete = id => {
    let item = this.state.todoList.filter(i => i.id === id)[0] || {};
    if (item.id) {
      item.complete = !item.complete;
      this.saveItem(item);
    }
  };

  saveItem = updatedItem => {
    this.setState({
      todoList: this.state.todoList.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      ),
      editing: false
    });
  };

  toggleEdit = id => {
    let editing = this.state.editing === id ? false : id;
    this.setState({ editing });
  };

  render() {
    return (
      <>
        {this.context.user.capabilities.map(item => {
          return <h1> {item} </h1>
        })}

        <section className="todo">
          <Auth capability="read">
            <div>
              <Counter count={this.state.todoList.length} />
            </div>
          </Auth>
          <Auth capability="create">
            <div>
              <form onSubmit={this.addItem}>
                <input
                  placeholder="Add To Do List Item"
                  onChange={this.handleInputChange}
                />
              </form>
            </div>
          </Auth>

          <div>
            <Auth capability="read">
              <ul>
                {this.state.todoList &&
                  this.state.todoList.map(item => (
                    <li
                      className={`complete-${item.complete.toString()}`}
                      key={item.id}
                    >
                      <If
                        condition={this.context.user.capabilities.includes(
                          "delete"
                        )}
                      >
                        <span onClick={() => this.toggleComplete(item.id)}>
                          {item.text}
                          {console.log(this.context)}
                        </span>
                      </If>
                      <If
                        condition={
                          !this.context.user.capabilities.includes("delete")
                        }
                      >
                        <span>{item.text}</span>
                      </If>
                      <Auth capability="update">
                        <button onClick={() => this.toggleEdit(item.id)}>
                          edit
                        </button>
                      </Auth>
                      <When condition={this.state.editing === item.id}>
                        <form onSubmit={this.updateItem}>
                          <input
                            onChange={this.handleInputChange}
                            id={item.id}
                            complete={item.complete}
                            defaultValue={item.text}
                          />
                        </form>
                      </When>
                    </li>
                  ))}
              </ul>
            </Auth>
          </div>
        </section>
      </>
    );
  }
}

export default ToDo;

// * Implement the following RBAC rules:
//     * Logged In Users with 'delete' permissions can click the records to mark them as complete
//     * Logged In Users with 'update' permissions can edit existing items
//     * Logged In Users with 'create' permissions can create new items
