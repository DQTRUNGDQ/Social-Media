import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../firebase-adminsdk.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: "gs://thread-clone-cd460.appspot.com",
});

const bucket = admin.storage().bucket();

export { bucket };
