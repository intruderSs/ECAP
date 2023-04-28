import React, { createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";


const AccountContext = createContext();

function Account(props) {

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = UserPool.getCurrentUser();
            if (user) {
                user.getSession(async (err, session) => {
                    if (err) {
                        reject();
                    } else {
                        //resolve(session);
                        const attributes = await new Promise((resolve, reject) => {
                            user.getUserAttributes((err, attributes) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    const results = {};
                                    for (let attribute of attributes) {
                                        const { Name, Value } = attribute;
                                        results[Name] = Value;
                                    }
                                    resolve(results);
                                    //getting user email and storing it into the local storage
                                    //console.log(results.email);
                                    //console.log(results.name);
                                   // console.log(results);
                                    localStorage.setItem('first_name', results.name);
                                    localStorage.setItem('last_name', results.nickname);
                                    localStorage.setItem('email', results.email);
                                    localStorage.setItem('username', results.sub);
                                }
                            })
                        })
                        resolve({ user, ...session, ...attributes });
                    }
                })
            } else {
                reject();
            }
        });
    }

    const sendCode = async (Username) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username,
                Pool: UserPool
            })

            user.forgotPassword({
                onSuccess: data => {
                    console.log("'onSuccess", data);
                    resolve(data);
                },
                onFailure: err => {
                    console.log("onFailure", err);
                    reject(err);
                },
                inputVerificationCode: data => {
                    console.log("input code : ", data);
                    resolve(data);
                }
            })
        });
    }

    const resetPass = async (Username, code, password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username,
                Pool: UserPool
            })

            user.confirmPassword(code, password, {
                onSuccess: data => {
                    //console.log("onSuccess : ", data);
                    resolve(data);
                },
                onFailure: err => {
                    //console.log("onFailure : ", err);
                    reject(err);
                }
            })
        });
    }

    const authenticate = async (Username, Password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username,
                Pool: UserPool
            });

            const authDetails = new AuthenticationDetails({
                Username,
                Password
            });

            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    //console.log("onSuccess: ", data);
                    resolve(data);
                },
                onFailure: (err) => {
                    //console.log("onFailure: ", err);
                    reject(err);
                },
                newPasswordRequired: (data) => {
                    //console.log("newPasswordRequired: ", data);
                    resolve(data);
                }
            })
        })
    };

    const logout = () => {
        const user = UserPool.getCurrentUser();
        if (user) {
            user.signOut();
        }
    };

    const verifyUser = async (Username, code) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username,
                Pool: UserPool
            });
            
            user.confirmRegistration(code, true, function(err, result) {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    reject(err);
                    // user.resendConfirmationCode(function(err, result) {
                    //     if (err) {
                    //         alert(err.message || JSON.stringify(err));
                    //         return;
                    //     }
                    //     console.log(result);
                    // });
                    return;
                }
                console.log('call result: ' + result);
                resolve(result);
            });
        })
    }

    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout, sendCode, resetPass, verifyUser }}>
            {props.children}
        </AccountContext.Provider>
    )
}

export { Account, AccountContext };