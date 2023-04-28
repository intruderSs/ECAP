import React, { useState } from "react";
import mailContext from "../context/mailContext";

const MailState = (props) => {

    const verifyMail = async (email) => {

        const response = await fetch(` https://b9tdhv1wva.execute-api.ap-south-1.amazonaws.com/dev/certificateList/verifyemail/${email}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });
        const json = await response.json();
        //console.log(json);
        console.log("SES verification mail sent successfully" + email);
    }

    const deleteMail = async (email) => {

        const response = await fetch(`https://b9tdhv1wva.execute-api.ap-south-1.amazonaws.com/dev/certificateList/deleteemail/${email}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });
        const json = await response.json();
        //console.log(json);
        console.log("Identity deleted successfully" + email);
    }

    const sendMail = async (sendEmail, receiveEmail, content, subject) => {

        await fetch(`https://b9tdhv1wva.execute-api.ap-south-1.amazonaws.com/dev/certificateList/sendemail`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({sendEmail, receiveEmail, content, subject}),
        }).then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            const data = res.json();
            //console.log(data);
            console.log("Email sent successfully");
        }).catch(err => {
            console.log(err);
        })
        
    }


    return (
        <mailContext.Provider value={{ verifyMail, deleteMail, sendMail }}>
        {props.children}
    </mailContext.Provider>
    )
}

export default MailState;