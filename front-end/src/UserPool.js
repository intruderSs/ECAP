import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    // UserPoolId: "ap-south-1_1Hr5lEcql",
    // ClientId: "42qo1g2l8vdl3j32nobjd57p6s"
    // UserPoolId: "ap-south-1_K1tPWYY78",
    // ClientId: "860tt801s4urgcaob1i73p985"
    UserPoolId: "ap-south-1_JGqLSZxnd",
    ClientId: "l2fn8409tb3s30pasko9idqsv"
}

export default new CognitoUserPool(poolData);