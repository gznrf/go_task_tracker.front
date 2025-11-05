import {Requests} from "../../../api/requests/requests.js";
import {pagesRoutes} from "../../../routes/routes.js";
import utils from "../../../utils/utils.js";

function registerUser() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let requestBody = {
        "name": name,
        "email": email,
        "password": password,
    }

    Requests.AuthRequests.register(requestBody)
        .then((response) => {
            if (response.status !== 200) {
                alert("Ups!");
            }
            window.location.replace(pagesRoutes["/login"]);
        })
        .catch(error => {
            alert(error.message);
        });
}

function registerButtonController() {
    const registerButton = document.querySelector('.register_button');
    registerButton.addEventListener('click', () => {
        try{
            registerUser();
        }catch(error){
            alert(error.message);
        }
    });
}

function toLoginUrlController() {
    const toLoginUrl = document.querySelector('.to_login_url');
    toLoginUrl.href = pagesRoutes["/login"];
}

async function onPageLoad() {

    await utils.components.loadComponents();
    registerButtonController()
    toLoginUrlController()
}

await onPageLoad()