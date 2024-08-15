"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appCheckVerification = exports.getFirebaseApp = exports.initializeFirebaseApp = void 0;
const app_1 = require("firebase-admin/app");
const app_check_1 = require("firebase-admin/app-check");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
let app;
const initializeFirebaseApp = () => {
    try {
        app = (0, app_1.initializeApp)(firebaseConfig);
        return app;
    }
    catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
};
exports.initializeFirebaseApp = initializeFirebaseApp;
const getFirebaseApp = () => app;
exports.getFirebaseApp = getFirebaseApp;
const appCheckVerification = async (req, res, next) => {
    const appCheckToken = req.header("X-Firebase-AppCheck");
    if (!appCheckToken) {
        res.status(401);
        return next("Unauthorized (No token)");
    }
    try {
        const appCheckClaims = await (0, app_check_1.getAppCheck)().verifyToken(appCheckToken);
        // If verifyToken() succeeds, continue with the next middleware
        // function in the stack.
        return next();
    }
    catch (err) {
        res.status(401);
        return next("Unauthorized (Bad token) : ");
    }
};
exports.appCheckVerification = appCheckVerification;
//# sourceMappingURL=firebase.js.map