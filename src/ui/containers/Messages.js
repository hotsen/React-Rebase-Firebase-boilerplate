import React, { Component } from 'react';
import Message from '../presentational/Message';
import base from '../../rebase.config.js';
import LoadingAnimation from '../presentational/LoadingAnimation';

class Messages extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      show: null,
      loading: true
    }
  }
  componentWillMount(){

    /*
     * We bind the 'chats' firebase endopint to our 'messages' state.
     * Anytime the firebase updates, it will call 'setState' on this component
     * with the new state.
     *
     * Any time we call 'setState' on our 'messages' state, it will
     * updated the Firebase '/chats' endpoint. Firebase will then emit the changes,
     * which causes our local instance (and any other instances) to update
     * state to reflect those changes.
     */

    this.ref = base.syncState('chats', {
      context: this,
      state: 'messages',
      asArray: true,
      then: () => {
          this.setState({
            loading: false
          });
      }
    });
  }
  componentWillUnmount(){
    /*
     * When the component unmounts, we remove the binding.
     * Invoking syncState (or bindToState or listenTo)
     * will return a reference to that listener (see line 30).
     * You will use that ref to remove the binding here.
     */

    base.removeBinding(this.ref);
  }
  _removeMessage(index, e){
    e.stopPropagation();
    var arr = this.state.messages.concat([]);
    arr.splice(index, 1);

    /*
     * Calling setState here will update the '/chats' ref on our Firebase.
     * Notice that I'm also updating the 'show' state.  Because there is no
     * binding to our 'show' state, it will update the local 'show' state normally,
     * without going to Firebase.
     */

    this.setState({
      messages: arr,
      show: null
    });
  }
  _toggleView(index){

    /*
     * Because nothing is bound to our 'show' state, calling
     * setState on 'show' here will do nothing with Firebase,
     * but simply update our local state like normal.
     */
    this.setState({
      show: index
    });
  }
  render(){
    const { messages} = this.state
    const mappedMessages = messages.map( (item, index) => {
      return (
        <Message
          thread={ item }
          show={ this.state.show === index }
          removeMessage={ () => this._removeMessage.bind(this, index) }
          handleClick={ () => this._toggleView.bind(this, index) }
          key={ index } />
      );
    });


    return (
        this.state.loading
        ? <LoadingAnimation height='auto'/>
        : <div>
            <h1>{ (messages.length || 0) + ' messages' }</h1>
            <ul>{ mappedMessages }</ul>
          </div>
    );
  }
}

export default Messages
