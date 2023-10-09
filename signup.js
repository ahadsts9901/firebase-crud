const firebaseConfig = {
    apiKey: "AIzaSyA93YcqOxOMeHDcoCQslObQ1FtCmRNnufY",
    authDomain: "polling-f42f3.firebaseapp.com",
    projectId: "polling-f42f3",
    storageBucket: "polling-f42f3.appspot.com",
    messagingSenderId: "29956748026",
    appId: "1:29956748026:web:f0502c192a36adc5e44f43",
    measurementId: "G-C56MRZG7DG",
};

firebase.initializeApp(firebaseConfig);


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user)
        window.location.href = "./index.html"
    } else {
        // console.log("not signed in");
    }
});


// signup

let signupForm = document.querySelector(".signupForm");


signupForm.addEventListener("submit", (event) => {

    event.preventDefault()

    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value

    console.log(email, password)

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = "./index.html";
        })
        .catch((error) => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username Already Taken',
                confirmButtonColor: "#005fcc"
            })
        });

})