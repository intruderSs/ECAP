import React, { useEffect, useState } from 'react';
import AddCertificate from './AddCertificate';
import { useNavigate } from 'react-router';

function Home(props) {
    const { showAlert } = props;

    let navigate = useNavigate();
    const [status, setStatus] = useState(false);


    useEffect(() => {
      if (localStorage.getItem('token')) {
         setStatus(true);
      } else {
        props.showAlert("First Authorize yourself", "", "warning");
        navigate("/login");
      }
    }, [])

    return (
        <div className='container'>
           {status && <AddCertificate showAlert={showAlert}/>}
        </div>
    )
}

export default Home;