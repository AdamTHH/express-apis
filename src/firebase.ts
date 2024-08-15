import { Request, Response } from "express";
import { initializeApp, App } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";

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

let app: App;

const initializeFirebaseApp = () => {
    try {
        app = initializeApp(firebaseConfig);
        return app;
    }
    catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
};

const getFirebaseApp = () => app;

const appCheckVerification = async (req: Request, res: Response, next: any) => {
    const appCheckToken = req.header("X-Firebase-AppCheck");

    if (!appCheckToken) {
        res.status(401);
        return next("Unauthorized (No token)");
    }

    try {
        const appCheckClaims = await getAppCheck().verifyToken(appCheckToken);

        // If verifyToken() succeeds, continue with the next middleware
        // function in the stack.
        return next();
    } catch (err) {
        res.status(401);
        return next("Unauthorized (Bad token) : ");
    }
}

const secretVerification = async (req: Request, res: Response, next: any) => {
    const secretCode = req.header("secret");

    if (!secretCode) {
        res.status(401);
        return next("No secret");
    }

    if (secretCode !== process.env.SECRET_CODE) {
        res.status(401);
        return next("Wrong secret");
    } else {
        return next();
    }
}

export { initializeFirebaseApp, getFirebaseApp, appCheckVerification, secretVerification };