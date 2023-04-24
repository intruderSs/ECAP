import React, { useContext, useEffect } from 'react';
import { Container, Row, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditCourse from './EditCourse';
import courseContext from '../context/courseContext';
import AddCourse from './AddCourse';
import ViewAllCourse from './ViewAllCourse';

function Courses(props) {

    const context = useContext(courseContext);
    const { allCourseData, getAllCourseData, updateCourse, addCourse} = context;

    useEffect(() => {
        getAllCourseData();
    }, []);

    return (
        <Container className='class-container'>
            <Row className='justify-content-center'>
                <Tabs justify variant='pills' defaultActiveKey="tab-1" className="mb-1 p-0 myClass">
                    <Tab eventKey="tab-1" title="View All">
                        <ViewAllCourse showAlert={props.showAlert}/>
                    </Tab>
                    <Tab eventKey="tab-2" title="Edit Skill Cluster">
                        <EditCourse allCourseData={allCourseData} updateCourse={updateCourse} showAlert={props.showAlert} getAllCourseData={getAllCourseData} />
                    </Tab>
                    <Tab eventKey="tab-3" title="Add Skill Cluster">
                        <AddCourse  allCourseData={allCourseData} addCourse={addCourse} showAlert={props.showAlert} getAllCourseData={getAllCourseData} />
                    </Tab>
                </Tabs>
            </Row>
        </Container>
    )
}

export default Courses;