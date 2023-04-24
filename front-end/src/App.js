import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import { Account } from "./context/Account";
import DataState from "./data/DataState";
import MailState from "./data/MailState";
import ViewCertificates from "./components/ViewCertificates";
import Alert from "./components/Alert";
import ViewAllCertificates from "./components/ViewAllCertificates";
import DeleteRequest from "./components/DeleteRequest";
import Dash from "./components/Dash";
import Explore from "./components/Explore";
import TrainingState from "./data/TrainingState";
import AdminDashboard from "./components/AdminDashboard";
import AdminTrainingData from "./components/AdminTrainingData";
import UserState from "./data/UserState";
import UploadData from "./components/UploadData";
import PendingRequests from "./components/PendingRequests";
import Courses from "./components/Courses";
import CourseState from "./data/CourseState";
import UploadCourse from "./components/UploadCourse";
import UserTrainingData from "./components/UserTrainingData";
import AddSkills from "./components/AddSkills";
import ApproveSkill from "./components/ApproveSkill";
import ApproveState from "./data/ApproveState";
import Projects from "./components/Projects/Projects";
import ProjectState from "./data/ProjectState";
import Test from "./components/testKnowledge/Test";
import TestState from "./data/TestState";

const App = () => {

    const [alert, setAlert] = useState(null);
    const showAlert = (message, body, type) => {
        setAlert({
            msg: message,
            body: body,
            type: type
        })
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    }

    return (
        <>
            <BrowserRouter>
                <Account>
                    <UserState>
                        <DataState>
                            <MailState>
                                <TrainingState>
                                    <ApproveState>
                                        <Header showAlert={showAlert} />
                                    </ApproveState>
                                    <Alert alert={alert} />
                                    <div className="container">
                                        <Routes>
                                            <Route exact path="/" element={<Dash showAlert={showAlert} />}></Route>
                                            <Route exact path="/addcertificate" element={<CourseState><Home showAlert={showAlert} /></CourseState>}></Route>
                                            <Route exact path="/about" element={<About />}></Route>
                                            {/* <Route exact path="/explore" element={<Explore showAlert={showAlert} />}></Route> */}
                                            <Route exact path='/login' element={<Login showAlert={showAlert} />}></Route>
                                            <Route exact path="/dashboard" element={<ViewCertificates showAlert={showAlert} />}></Route>
                                            <Route exact path="/admin" element={<AdminDashboard showAlert={showAlert} />}></Route>
                                            <Route exact path="/trainingdata" element={<AdminTrainingData showAlert={showAlert} />}></Route>
                                            <Route exact path="/viewall" element={<ViewAllCertificates showAlert={showAlert} />} ></Route>
                                            <Route exact path="/deleterequest" element={<DeleteRequest showAlert={showAlert} />} ></Route>
                                            <Route exact path="/uploadcsv" element={<UploadData showAlert={showAlert} />} ></Route>
                                            <Route exact path="/pendingrequests" element={<PendingRequests showAlert={showAlert} />} ></Route>
                                            <Route exact path="/courses" element={<CourseState><Courses showAlert={showAlert} /></CourseState>} ></Route>
                                            <Route exact path="/uploadcourse" element={<CourseState><UploadCourse showAlert={showAlert} /></CourseState>} ></Route>
                                            <Route exact path="/usertrainingdata" element={<UserTrainingData showAlert={showAlert} />} ></Route>
                                            <Route exact path="/userskills" element={<CourseState><ApproveState><AddSkills showAlert={showAlert} /></ApproveState></CourseState>} ></Route>
                                            <Route exact path="/approveskill" element={<CourseState><ApproveState><ApproveSkill showAlert={showAlert} /></ApproveState></CourseState>} ></Route>
                                            <Route exact path="/projects" element={<ProjectState><CourseState><Projects showAlert={showAlert} /></CourseState></ProjectState>} ></Route>
                                            <Route exact path="/testknowledge" element={<CourseState><TestState><Test showAlert={showAlert} /></TestState></CourseState>} ></Route>
                                        </Routes>
                                    </div>
                                    <Footer />
                                </TrainingState>
                            </MailState>
                        </DataState>
                    </UserState>
                </Account>
            </BrowserRouter>
        </>
    )
}

export default App;