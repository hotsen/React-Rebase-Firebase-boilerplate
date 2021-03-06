import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import base from '../../rebase.config.js';
import { FormGroup, FormControl, Button, ControlLabel} from 'react-bootstrap';

class NewChat extends Component {
  _newChat(e){
    e.preventDefault();

    /*
     * Here, we call .post on the '/chats' ref
     * of our Firebase.  This will do a one-time 'set' on
     * that ref, replacing it with the data prop in the
     * options object.
     *
     * Keeping with the immutable data paradigm in React,
     * you should never mutate, but only replace,
     * the data in your Firebase (ie, use concat
     * to return a mutated copy of your state)
    */

    base.post('chats', {
      data: this.props.chats.concat([{
        title: ReactDOM.findDOMNode(this.refs.title).value,
        message: ReactDOM.findDOMNode(this.refs.message).value
      }]),
      context: this,
      /*
       * This 'then' method will run after the
       * post has finished.
       */
      then: () => {
        console.log('POSTED');
      }
    });

    ReactDOM.findDOMNode(this.refs.message).value = '';
    ReactDOM.findDOMNode(this.refs.title).value = '';

  }
  render(){
    return (
        <form onSubmit={ () => this._newChat() }>
          <FormGroup>
            <ControlLabel>Title:</ControlLabel>
            <FormControl type="text" ref='title' placeholder='Title' />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Message:</ControlLabel>
            <FormControl componentClass="textarea" ref='message' placeholder='Message' />
          </FormGroup>
          <Button type='submit' className='btn btn-success'>Submit</Button>
        </form>
    )
  }
}

export default NewChat;
