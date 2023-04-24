let username = "";
let email_id = "";

const getUserName = (headers) => {
  console.log("username is: " + headers.userName);
  username = headers.userName;
  return username;
}

const getEmailId = (headers) => {
  console.log("email_id is: " + headers.email_id);
  email_id = headers.email_id;
  return email_id;
}

const statement =(statusCode, data)=>{
    return{
      statusCode,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'PUT, POST, DELETE, GET',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
        'userName': username
      },
    };
  }

  module.exports={
    statement,
    getUserName,
    getEmailId
  }

  