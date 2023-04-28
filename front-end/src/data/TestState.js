import React, { useState } from "react";
import testContext from "../context/testContext";


const TestState = (props) => {
    const Initial = [];

    const [alltestData, setAllTestData] = useState(Initial);

    ///getCourseData
    const getAllTestData = async (course_name) => {
        //todo api call
        const response = await fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/knowledgetest/all?course_name=` + course_name, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
        //console.log(json);
        ////till here array of items is visible in console
        setAllTestData(json.Items);
    }

    const getTestData = async (course_name) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/knowledgetest/all?course_name=` + course_name, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            })
                .then(data => {
                    resolve(data.json());
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    //add course
    const addTestData = async (course_name,
        test
    ) => {
        //api call
        return await new Promise((resolve, reject) => {
            fetch("https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/knowledgetest/add", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ course_name, test })
            }).then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                const data = res.json();
                //console.log(data);
                // console.log("Adding a new certificate data");
                resolve(data);
            }).catch(err => {
                console.log(err.message);
                reject(err.message);
            })
        })
    }

    return (
        <testContext.Provider value={{ alltestData, addTestData, getAllTestData, getTestData }}>
            {props.children}
        </testContext.Provider>
    )
}

export default TestState;
