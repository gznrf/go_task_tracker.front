import utils from "../../../utils/utils.js";
import {Requests} from "../../../api/requests/requests.js";
import {pagesRoutes} from "../../../routes/routes.js";


function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let requestBody = {
        "email": email,
        "password": password,
    }

    Requests.AuthRequests.login(requestBody)
        .then((response) => {
            if (response.status !== 200) {
                alert("Ups!");
            }
            window.location.replace(pagesRoutes["/projects"]);
        })
        .catch(error => {
            alert(error.message);
        });
}

function loginButtonController() {
    const loginButton = document.querySelector('.login_button');
    loginButton.addEventListener('click', () => {
        try{
            loginUser();
        }catch(error){
            alert(error.message);
        }
    });
}

function toRegisterUrlController() {
    const toRegisterUrl = document.querySelector('.to_register_url');
    toRegisterUrl.href = pagesRoutes["/register"];
}

async function onPageLoad() {

    await utils.components.loadComponents();
    loginButtonController()
    toRegisterUrlController()
}

await onPageLoad()