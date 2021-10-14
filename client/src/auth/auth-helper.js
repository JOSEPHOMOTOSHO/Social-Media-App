// import { signOut } from "./api-auth";
//store jwt
function authenticate(jwt, cb) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("jwt", JSON.stringify(jwt));
  }
  cb();
}

//retrieve jwt
function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }
  if (sessionStorage.getItem("jwt")) {
    return JSON.parse(sessionStorage.getItem("jwt"));
  } else {
    return false;
  }
}

//remove credentials/jwt
function clearJwt(cb) {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("jwt");
    cb();
    // signOut().then((data)=>)
  }
}

export { authenticate, isAuthenticated, clearJwt };
