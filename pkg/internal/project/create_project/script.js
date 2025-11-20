import {Requests} from "../../../api/requests/requests.js";
import {pagesRoutes} from "../../../routes/routes.js";
import utils from "../../../utils/utils.js";

function createProject() {
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;

    let requestData = {
        "name": name,
        "description": description,
    }
    Requests.ProjectRequests.create(requestData)
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

function createButtonController() {
    const createButton = document.querySelector('.create_button');
    createButton.addEventListener('click', () => {
        createProject();
    });
}

function backButtonController() {
    const backButton = document.querySelector('.back_button');
    backButton.addEventListener('click', () => {
        window.location.replace(pagesRoutes["/projects"]);
    });
}

async function onPageLoad() {
    await utils.components.loadComponents();
    backButtonController();
    createButtonController();
}

await onPageLoad();



