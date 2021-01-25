import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './App.css';

import { HOME } from './shared/config';
import Layout from './hoc/Layout';
import InsideLayout from './containers/AppWrapper';
import Auth from './containers/Auth/Auth';


import * as actions from './store/actions/index';

const testDrawerItems = () => {
    let ll = [];
    for (let i = 0; i < 250; i++) {
        ll = [...ll, { key: `${i}`, route: HOME, active: i % 2 === 0, label: "SOME LBA" }];
    }
    return ll;
}

function App(props) {
    const onTryAutoSignIn = props.onTryAutoSignIn;

    useEffect(() => {
        onTryAutoSignIn();
    }, [onTryAutoSignIn]);

    let routes = <Auth />;

    if (props.isAuthenticated) {
        routes = (
            <Layout authDrawerItems={testDrawerItems()}>
                <InsideLayout />
            </Layout>
        );
    }

    return (
        <div className="App">
            {routes}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignIn: () => dispatch(actions.authCheckState())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
