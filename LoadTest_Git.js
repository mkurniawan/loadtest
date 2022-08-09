import {
    check,
    group,
    sleep,
    randomSeed
} from 'k6';
import http from 'k6/http';

// This will export to HTML as filename "result.html" AND also stdout using the text summary
// import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export let options = {

    // Basic Option
    vus: 1,
    duration: '3s',

    // Load Test Option
    // stages: [
    //   { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    //   { duration: '10m', target: 100 }, // stay at 100 users for 1 minutes
    //   { duration: '5m', target: 0 }, // ramp-down to 0 users
    // ],
    thresholds: {
        http_req_failed: ['rate<0.02'], //validates that the request faileld is less than 2%
        http_req_duration: ['p(80)<3000'] // validates that 80% of the requests' duration should be under 3s
    },
};

const baseurl = ''; //your api's base url

export default function () {

    // Login
    const url = ''; //your login api url
    const payload = JSON.stringify({
        identifier: '',
        password: '',
    });

    const params = {
        headers: {
            'x-api-key': 'bCYgXHVeKaMZGzhOaxWX',
            'Content-Type': 'application/json',
        },
    };
    const loginRes = http.post(url, payload, params);
    check(loginRes, {
        'logged in successfully': (resp) => resp.json('xxx') !== '', //xxx is your login token's variable
    });

    // Retrieve User ID from login request
    const userid = loginRes.json('xxxid') //xxxid is your user id variable returned from login request

    // Set Authorized Header for next requests
    const authHeaders = {
        headers: {
            Authorization: `Bearer ${loginRes.json('xxx')}`, //xxx is your login token's variable
            'x-api-key': 'bCYgXHVeKaMZGzhOaxWX',
            'Content-Type': 'application/json'
        },
    };

    //Other Request 
    // 1. Get Request
    const userinfo = http.get(`${baseurl}/xxx`, authHeaders); //xxx is your url path
    check(userinfo, {
        '1. User Info Successfully Retrieved': (r) => r.status === 200,
    });


    // 2. Put Request
    const updateprofile = http.put(`${baseurl}/xxx/${JSON.stringify(userid)}`, authHeaders, { //xxx is your url path

        // this should contains list of the editable fields
        firstName: "dona edit",
        lastName: "name",
        
    });

    check(updateprofile, {

        '2. Profile Updated Sucessfully': (resp) => resp.status === 200,
    });


    // 3. Other Get Request
    const medguid = http.get(`${baseurl}/xxx`, authHeaders);
    check(medguid, {
        '3. This Request is successfully Retrieved': (r) => r.status === 200,
    });


};

//Generating K6 Report
export function handleSummary(data) {
    const datestring = new Date();
    return {
        "result.html": htmlReport(data),
        stdout: textSummary(data, {
            indent: " ",
            enableColors: true
        }),
    };
}