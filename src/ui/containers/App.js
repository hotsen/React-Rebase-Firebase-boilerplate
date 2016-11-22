import React, { Component } from 'react'
import Container from '../layout/Container'
import Header from '../presentational/Header'
import base from '../../rebase.config.js'
import { browserHistory } from 'react-router'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasUser: false,
            loading: true,
            firebaseUser: null
        }
    }

    componentWillMount() {
        const authDataCallback = (user) => {
            if (user) {
                if (user.emailVerified) this.setState({hasUser: true, loading: false, firebaseUser: user})
            } else {
                this.setState({hasUser: false, loading: false})
                browserHistory.replace('/login')
            }
        }
        // Listen to authentication
        this.unsubscribeToAuthListener = base.onAuth(authDataCallback)
    }

    componentWillUnmount() {
        //to remove auth listener
        this.unsubscribeToAuthListener()
    }

    onLogoutClicked(event) {
      base.auth().signOut()
      this.setState({hasUser: false})
      browserHistory.replace('/login')
    }

    render() {

        const { loading, hasUser, firebaseUser } = this.state

        return (
            <div>
                <Header hasUser={hasUser} loading={loading} firebaseUser={firebaseUser} logout={ () => this.onLogoutClicked() }/>
                <Container size={'medium'}>
                    {this.props.children}
                </Container>
            </div>
        )
    }
}

App.propTypes = {
  children: React.PropTypes.node,
}

export default App
