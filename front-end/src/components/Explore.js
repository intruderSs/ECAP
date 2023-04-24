import React from "react";
import { Link } from "react-router-dom";
import AWS from "./homeComponents/AWS";

function Explore() {

    return (
        <>
            <div className="custom-nav">
                <div className="bg">
                    <ul className="header-position nav nav-tabs cust-ul">
                        <li className="nav-item">
                            <Link id="home-mini" className='nav-link active' aria-current="true" to="#/aws">AWS</Link>
                        </li>
                        <li className="nav-item">
                            <Link id="home-mini" className='nav-link' aria-current="true" to="#/gcp">Google Cloud</Link>
                        </li>
                        <li className="nav-item">
                            <Link id="home-mini" className='nav-link' aria-current="true" to="#/azure">Azure</Link>
                        </li>
                        <li className="nav-item">
                            <Link id="home-mini" className='nav-link' aria-current="true" to="#/salesforce">Salesforce</Link>
                        </li>
                        <li className="nav-item">
                            <Link id="home-mini" className='nav-link' aria-current="true" to="#/ibm">IBM Cloud</Link>
                        </li>
                        <li className="nav-item">
                            <Link id="home-mini" className='nav-link' aria-current="true" to="#/oracle">Oracle</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card-body">
            <AWS />
            </div>
        </>
    )
}

export default Explore;