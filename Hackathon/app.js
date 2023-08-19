

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,  signInWithEmailAndPassword, onAuthStateChanged,  signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { addDoc, collection, doc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js" 


const firebaseConfig = {
  apiKey: "AIzaSyCZ-R3N-2YL9AwLCV1AjjOkferDZXX7CBk",
  authDomain: "hackathon-56672.firebaseapp.com",
  projectId: "hackathon-56672",
  storageBucket: "hackathon-56672.appspot.com",
  messagingSenderId: "149082363346",
  appId: "1:149082363346:web:33a337a3b8c0ab9220640b",
  measurementId: "G-4Q0F07FZHY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);


const registerBtn = document.getElementById('register-btn');

registerBtn && registerBtn.addEventListener("click", (e) => {
  e.preventDefault()
  let fullName = document.getElementById("First")
  let lastName = document.getElementById("Last")
  let email = document.getElementById("email")
  let password = document.getElementById("password")
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      try {
        const user = userCredential.user;
        await setDoc(doc(db, "user", user.uid ), {
          fullName: fullName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value
        });
        Swal.fire({
          icon: 'success',
          title: 'User register successfully',
        })
        localStorage.setItem("uid", user.uid)
        location.href = "profile.html"
      } catch (err) {
        console.log(err)
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    });
})


const loginBtn = document.getElementById('login-btn');

loginBtn && loginBtn.addEventListener("click", (e) => {
  e.preventDefault()
  let email = document.getElementById("email")
  let password = document.getElementById("password")
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      try {
        Swal.fire({
          icon: 'success',
          title: 'User login successfully',
        })
        localStorage.setItem("uid", userCredential.user.uid)
       window.location.href = "../Home/home.html"
      } catch (err) {
        console.log(err)
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    });
})

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
   console.log("user login")
  } else {
    console.log("User is signed out")
   
  }
});


const fileInput = document.getElementById("file-input");

fileInput && fileInput.addEventListener("change", () => {
    console.log(fileInput.files[0])
    userProfile.src = URL.createObjectURL(fileInput.files[0])
})

const updateProfile = document.getElementById("update-profile");

updateProfile && updateProfile.addEventListener("click", async () => {
    let uid = localStorage.getItem("uid")
    let fullName = document.getElementById("fullName")
    let email = document.getElementById("email")
    const imageUrl = await uploadFile(fileInput.files[0])
    const washingtonRef = doc(db, "users", uid);
    await updateDoc(washingtonRef, {
        fullName: fullName.value,
        email: email.value,
        picture: imageUrl
    });
    Swal.fire({
        icon: 'success',
        title: 'User updated successfully',
    })
})

const logoutBtn = document.getElementById('log-out')
const logOut = document.getElementById('logout');
logOut.addEventListener('click', ()=>{
    const auth = getAuth();
    signOut(auth).then(() => {
        window.location.href = '../index.html';
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
  })
  var btn=document.getElementById("post-btn");
  
  btn.addEventListener("click",async()=>{
  
    var title=document.getElementById("title").value
    var para=document.getElementById("para").value
    
  
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      title:title,
      para:para
      
    })
  
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
  async function showpro(){ 
    let card = document.getElementById("card")
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
    card.innerHTML += `
    <div class="shadow  w-100 m-auto p-5 my-2"><h1>${doc.data().title}</h1>

    <p>${doc.data().para}</p>
    
    <button class="btn btn-primary" onclick="delet('${doc.id}')">Delete</button>
    </div>    
    `
  console.log(`${doc.id} => ${doc.data()}`);
  });
  
  }
  showpro();
  
  })
  
  
  async function delet(id){
    await deleteDoc(doc(db, "blogs",id));
    alert("your post has deleted")
    window.location.href="./home.html"
  
  }
  window.delet=delet