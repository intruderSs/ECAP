import React, { useState } from "react";
import courseContext from "../context/courseContext";

const CourseState = (props) => {
    const Initial = [];

    const [allCourseData, setAllCourseData] = useState(Initial);

    ///getCourseData
    const getAllCourseData = async () => {
        //todo api call
        const response = await fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/course/all`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
        //console.log(json);
        ////till here array of items is visible in console
        setAllCourseData(json.Items);
    }

    ///deleteCourse
    const deleteCourseData = async (course_name) => {

        return await new Promise((resolve, reject) => {
            fetch('https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/course/delete/' + course_name, {
                method: "DELETE",
                // headers: {
                //     'Content-Type': 'application/json',
                //     "Access-Control-Allow-Origin": "*",
                //     'Access-Control-Allow-Credentials': true,
                //     'Access-Control-Allow-Methods':'DELETE',
                // }
            }).then(res => {
                const json = res.json();
                resolve(json);
                //console.log(json);
                console.log("Deleting the course" + course_name);
                const newData = allCourseData.filter((data) => { return data.course_name !== course_name });
                allCourseData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }

    //add course
    const addCourse = async (course_name,
       skill_set
    ) => {
        //api call
        return await new Promise((resolve, reject) => {
            fetch("https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/course/add", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ course_name, skill_set})
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

    //updateCourse
    const updateCourse = async (
        course_name,
        skill_set) => {

        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/course/update`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ course_name, skill_set })
            }).then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(allCourseData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.usecert === course_name) {
                        newData[index].skill_set = skill_set;
                        break;
                    }
                }
                setAllCourseData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }


    return (
        <courseContext.Provider value={{ allCourseData, getAllCourseData, deleteCourseData, addCourse, updateCourse }}>
            {props.children}
        </courseContext.Provider>
    )
}

export default CourseState;
