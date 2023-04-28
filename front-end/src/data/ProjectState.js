import React, { useState, useEffect } from "react";
import projectContext from "../context/projectContext";

const ProjectState = (props) => {
    const Initial = [];

    const [allProjectData, setAllProjectData] = useState(Initial);

    ///getCourseData
    const getAllProject = async () => {
        //todo api call
        const response = await fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/projects/all`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            }
        });

        const json = await response.json();
        //console.log(json);
        ////till here array of items is visible in console
        setAllProjectData(json.Items);
    }

    ///deleteCourse
    // const deleteCourseData = async (course_name) => {

    //     return await new Promise((resolve, reject) => {
    //         fetch('https://11h11u0e9l.execute-api.ap-south-1.amazonaws.com/dev/course/delete/' + course_name, {
    //             method: "DELETE",
    //             // headers: {
    //             //     'Content-Type': 'application/json',
    //             //     "Access-Control-Allow-Origin": "*",
    //             //     'Access-Control-Allow-Credentials': true,
    //             //     'Access-Control-Allow-Methods':'DELETE',
    //             // }
    //         }).then(res => {
    //             const json = res.json();
    //             resolve(json);
    //             //console.log(json);
    //             console.log("Deleting the course" + course_name);
    //             const newData = allCourseData.filter((data) => { return data.course_name !== course_name });
    //             allCourseData(newData);
    //         }).catch(err => {
    //             reject(err);
    //         })
    //     })
    // }

    //add course
    const addProject = async (project_id, project_name,
        description, satrting_date, ending_date, skills_required, team
    ) => {
        //api call
        return await new Promise((resolve, reject) => {
            fetch("https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/knowledgetest/add", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ project_id, project_name, description, satrting_date, ending_date, skills_required, team})
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

    ////updateTeam
    const updateTeam = async (
        project_id,
        team) => {
        return await new Promise((resolve, reject) => {
            fetch(`https://2pnugsu1o4.execute-api.ap-south-1.amazonaws.com/dev/project/update/${project_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",

                },
                body: JSON.stringify({ project_id, team })
            }).then(res => {
                const json = res.json();
                //console.log(json);
                resolve(json);
                let newData = JSON.parse(JSON.stringify(allProjectData))
                ///client side edit logic
                for (let index = 0; index < newData.length; index++) {
                    const element = newData[index];
                    if (element.project_id === project_id) {
                        newData[index].team = team;
                        break;
                    }
                }
                setAllProjectData(newData);
            }).catch(err => {
                reject(err);
            })
        })
    }


    return (
        <projectContext.Provider value={{  allProjectData, addProject, getAllProject, updateTeam }}>
            {props.children}
        </projectContext.Provider>
    )
}

export default ProjectState;
