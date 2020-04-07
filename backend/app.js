const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");
var admin = require("firebase-admin");
const axios = require("axios");
require("dotenv").config();

let defaultAppConfig = {
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE__KEY_ID,
    private_key: process.env.PRIVATE__KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URL,
    token_uri: process.env.TOKEN_URL,
    auth_provider_x509_cert_url: process.env.AUTH_PRIVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  }),
  databaseURL: process.env.DATABASEURL,
};
admin.initializeApp(defaultAppConfig);

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

app.get("/", async (req, res) => {
  return res.send("Hi");
});

//1 เพื่อตรวจสอบว่า regisหรือยัง
app.get("/line", async (req, res) => {
  let urlLine = "https://api.line.me/v2/profile";
  var _lineId = "";
  var lineToken = req.headers.token;
  console.log(lineToken);
  try {
    let response = await axios.get(urlLine, {
      headers: {
        Authorization: "Bearer " + lineToken, //the token is a variable which holds the token
      },
    });
    _lineId = response.data.userId;
    console.log(_lineId);
    const docRef = db.collection("user").doc(_lineId);
    const getDoc = await docRef.get();
    if (!getDoc.exists) {
      console.log("No such document!");
      return res.sendStatus(404);
    }
    console.log(getDoc.data());
    var _access_token = getDoc.data().access_token;
    var n = _access_token.length;
    if (n > 0) {
      console.log(" res.sendStatus(200);");
      res.sendStatus(200);
    } else {
      console.log(" res.sendStatus(404);");
      res.sendStatus(404);
    }
  } catch (error) {
    console.log("catch");
    console.log(error);
    console.log(error.response.status);
    if (error.response.status == 401) {
      return res.sendStatus(401);
    } else {
      return res.sendStatus(500);
    }
  }
});

//2regis login
app.post("/line", async (req, res) => {
  var _lineId = "";
  var _access_token = "";
  var _refresh_token = "";
  var _cmuitaccount = "";
  var lineToken = req.headers.token;
  var oauthCode = req.headers.code;
  console.log(lineToken);
  let urlLine = "https://api.line.me/v2/profile";
  let urlgettoken = "https://oauth.cmu.ac.th/v1/gettoken.aspx";
  let urlbasicinfo =
    "https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo";

  try {
    let responseprofile = await axios.get(urlLine, {
      headers: {
        Authorization: "Bearer " + lineToken, //the token is a variable which holds the token
      },
    });
    console.log("oauthCode" + oauthCode);
    // console.log(response);
    _lineId = responseprofile.data.userId;
    var clientId = process.env.CLIENT_ID;
    var clientSecret = process.env.CLIENTSECRET;
    var granttype = process.env.GRANTTYPE;
    var ui = process.env.UI;
    const params = new URLSearchParams();
    params.append("code", oauthCode);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", granttype);
    params.append("redirect_uri", ui);

    let responseGetToken = await axios.post(urlgettoken, params);
    console.log(responseGetToken);
    _access_token = responseGetToken.data.access_token;
    _refresh_token = responseGetToken.data.refresh_token;

    let responseGetBasic = await axios.get(urlbasicinfo, {
      headers: {
        Authorization: "Bearer " + _access_token, //the token is a variable which holds the token
      },
    });
    _cmuitaccount = responseGetBasic.data.cmuitaccount;
    let setDoc = db.collection("user").doc(_lineId);
    let setBook = setDoc
      .set({
        cmuitaccount: _cmuitaccount,
        lineId: _lineId,
        access_token: _access_token,
        refresh_token: _refresh_token,
      })
      .then((doc) => {
        return res.sendStatus(200);
      })
      .catch((err) => {
        console.log("Error getting document", err);
        return res.sendStatus(500);
      });
  } catch (error) {
    console.log("catch");
    console.log(error);
    console.log(error.response.status);
    if (error.response.status == 401) {
      return res.sendStatus(401);
    } else {
      return res.sendStatus(500);
    }
  }
});
