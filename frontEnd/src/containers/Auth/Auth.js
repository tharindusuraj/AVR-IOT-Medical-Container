import React, {useState, useCallback} from 'react';

import {connect} from 'react-redux';

import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';

import Spinner from '../../components/UI/Spinner/Spinner';

import {checkValidity} from '../../shared/validate';
import {updateObject, formIsValid} from '../../shared/utility';
import {buildTextFields} from '../../helpers/uiHelpers';
import {auth, addAlert} from '../../store/actions/index';
import companyLogo from './logo.jpg';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        backgroundColor: '#ffffff',
    },
    image: {
        backgroundImage: `url(${companyLogo})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#ffffff',
        // backgroundSize:"auto",
        backgroundSize: '60%',
        backgroundPosition: 'right',
        // backgroundColor:
        //     theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        alignSelf: 'inherit'
    },

    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: '#adea6a',
        color: '#2264c4',
        fontWeight:'bold'
    },
}));

const inputDefinitions = {
    email: {
        label: 'Email',
        fullWidth: true,
        validations: {
            required: true,
            isEmail: true,
            validationErrStr: 'Enter a valid email'
        },
        propsToPass: {
            name: "email",
            autoComplete: "email",
            autoFocus: true,
            id: "email",
            required: true,
            margin: "normal"
        }
    },
    password: {
        label: 'Password',
        type: 'password',
        fullWidth: true,
        validations: {
            required: true,
            minLength: 6,
            maxLength: 40,
            validationErrStr: 'Use between 6 and 40 characters for your password'
        },
        propsToPass: {
            name: "password",
            id: "password",
            autoComplete: "current-password",
            required: true,
            margin: "normal"
        }
    }
};

const Auth = (props) => {
    const classes = useStyles();

    const [inputIsValid, setInputIsValid] = useState({
        email: true,
        password: true
    });
    const [authObj, setAuthObj] = useState({
        email: '',
        password: ''
    });

    const inputProperties = {
        email: {
            styleClass: classes.loginInput
        },
        password: {
            styleClass: classes.loginInput
        }
    };

    const inputChangeHandler = useCallback((event, inputId) => {
        let validationConst = inputDefinitions[inputId].validations;
        let isValid = checkValidity(validationConst, event.target.value);
        setInputIsValid(updateObject(inputIsValid, {[inputId]: isValid}));
        setAuthObj(updateObject(authObj, {[inputId]: event.target.value}))
    }, [authObj, inputIsValid]);

    const checkInputValidity = useCallback((inputId, newValue) => {
        let isValid = true;

        let validationConst = inputDefinitions[inputId].validations;
        isValid = checkValidity(validationConst, newValue ? newValue : authObj[inputId])

        return isValid;
    }, [authObj]);

    const onSubmitHandler = useCallback((event) => {
        event.preventDefault()
        let localInputIsValid = {...inputIsValid};
        localInputIsValid['email'] = checkInputValidity('email');
        localInputIsValid['password'] = checkInputValidity('password');
        setInputIsValid(localInputIsValid);

        if (localInputIsValid['email'] && localInputIsValid['password']) {
            props.onAuth(
                authObj.email,
                authObj.password
            );
        }
    }, [authObj, checkInputValidity, inputIsValid, props]);

    const inputFields = buildTextFields(inputDefinitions, inputProperties, inputChangeHandler, inputIsValid);


    return (
        <Grid container component="main" className={classes.root}>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.root}>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography style={{color: "#2264c4",fontWeight:'bold'
                    }} component="h1" variant="h5">
                        Sign In
                    </Typography>
                    {props.loading ?
                        <Spinner size={30}/>
                        :
                        <Typography variant="body1" style={{color: 'red'}}>
                            {props.error}
                        </Typography>}
                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={onSubmitHandler}>
                        {inputFields}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            // color='primary'
                            className={classes.submit}
                            disabled={!formIsValid(inputIsValid)}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
            </Grid>
            <Grid item xs={false} sm={4} md={7} className={classes.image}/>
        </Grid>
    );
}

const mapStateToProps = (state) => {
    return {
        error: state.error,
        loading: state.loading,
        isAuthenticated: state.token != null,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password) => dispatch(auth(email, password)),
        addAlert: (alert) => dispatch(addAlert(alert))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);