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
let db = firebase.firestore();


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // console.log(user)
    } else {
        window.location.href = "./login.html"
        // console.log("not signed in");
    }
});


let form = document.querySelector(".form")

form.addEventListener("submit", (event) => {
    event.preventDefault()
    let title = document.querySelector("#title").value
    let text = document.querySelector("#text").value
    let timestamp = firebase.firestore.FieldValue.serverTimestamp()

    db.collection("posts")
        .add({
            title: title,
            text: text,
            timestamp: timestamp
        })
        .then(function (docRef) {
            Swal.fire({
                icon: "success",
                title: "Added",
                text: "Post Done",
                confirmButtonColor: "#0079ff",
                showConfirmButton: false,
                timer: 1500,
            });
            render();
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });

    document.querySelector("#title").value = ""
    document.querySelector("#text").value = ""

})

function render() {
    var container = document.querySelector(".posts");
    container.innerHTML = "";

    db.collection("posts")
        .orderBy("timestamp", "desc") //sort by time
        .get()
        .then(function (querySnapshot) {
            if (querySnapshot.size === 0) {
                container.innerHTML = "<div class='blue text-[2em]'>No Post found</div>";
            } else {
                querySnapshot.forEach(function (doc) {
                    var data = doc.data();

                    // console.log(data)

                    var card = document.createElement("div");
                    card.className = "singlePost"
                    container.appendChild(card);

                    var heading = document.createElement("h3");
                    heading.className = "title"
                    heading.textContent = data.title;
                    card.appendChild(heading);

                    var text = document.createElement("p");
                    text.className = "text"
                    text.textContent = data.text;
                    card.appendChild(text);

                    var para = document.createElement("div");
                    para.className = "actions";
                    card.appendChild(para);

                    var del = document.createElement("i");
                    // del.className += " bi bi-trash-fill buttons";
                    del.textContent = " Delete"
                    del.addEventListener("click", delDoc);
                    para.appendChild(del);

                    var edit = document.createElement("i");
                    // edit.className += " bi bi-pencil-fill buttons";
                    edit.textContent = " Edit"
                    edit.addEventListener("click", editDoc);
                    para.appendChild(edit);

                    // ...................................................................................................................

                    //delete function

                    function delDoc(postId) {
                        // Show a confirmation popup using SweetAlert
                        Swal.fire({
                            title: "Delete Post",
                            text: "Are you sure you want to delete this post?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#0079ff",
                            cancelButtonColor: "#0079ff",
                            confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                            if (result.isConfirmed) {

                                let docId = doc.id;
                                db.collection("posts").doc(docId).delete()
                                    .then(() => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Deleted",
                                            text: "Post has been deleted.",
                                            confirmButtonColor: "#0079ff",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                        render();
                                    })
                                    .catch((error) => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Error",
                                            text: "An error occurred while deleting the post.",
                                            confirmButtonColor: "#0079ff",
                                        });
                                        console.error(error)
                                    });
                            }
                        });
                    }

                    async function editDoc(event) {
                        event.preventDefault();
                        let password = "123"
                        if (password === "123") {
                            let title = data.title;
                            let text = data.text;

                            const { value: formValues } = await Swal.fire({
                                title: "Edit",
                                html: `<input value="${title}" type="text" id="swal-input1" class="swal2-input nameSwal" placeholder="Title..." minlength="5" maxlength="16">` +
                                    `<textarea type="text" id="swal-input2" class="swal2-input fatherSwal" placeholder="Text..." minlength="40" maxlength="200">${text}</textarea>`,
                                confirmButtonColor: "#0d86ff",
                                confirmButtonText: "Edit",
                                showCancelButton: true,
                                cancelButtonColor: "#0d86ff",
                                cancelButtonText: "Cancel",
                                focusConfirm: false,
                                preConfirm: () => {
                                    const titleValue =
                                        document.getElementById("swal-input1").value;
                                    const textValue =
                                        document.getElementById("swal-input2").value;

                                    if (
                                        titleValue.trim() === "" ||
                                        textValue.trim() === ""

                                    ) {
                                        Swal.showValidationMessage(
                                            "Please enter a value for each field"
                                        );
                                        return false;
                                    }

                                    return [titleValue, textValue];
                                },
                            });

                            if (formValues) {
                                let docId = doc.id;
                                db.collection("posts")
                                    .doc(docId)
                                    .update({
                                        title: formValues[0],
                                        text: formValues[1],
                                    })
                                    .then(() => {
                                        render();
                                        Swal.fire({
                                            icon: "success",
                                            title: "Edited",
                                            confirmButtonText: "OK",
                                            confirmButtonColor: "#0d86ff",
                                        });
                                    })
                                    .catch((error) => {
                                        console.error("Error updating document: ", error);
                                    });
                            }
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Access Denied",
                                confirmButtonText: "OK",
                                confirmButtonColor: "#0d86ff",
                            });
                        }
                    }

                })
            }
        })
}

document.addEventListener("DOMContentLoaded", function () {
    render();
});

let logOutBtn = document.querySelector(".logOut")

logOutBtn.addEventListener("click", () => {

    firebase
        .auth()
        .signOut()
        .then(() => {
            // console.log("Sign out successful");
            // Redirect to the sign-in page or any other desired destination
            window.location.href = "./login.html";
        })
        .catch((error) => {
            console.log("Sign out error:", error);
        });

})