import {Requests} from "../../../api/requests/requests.js";
import {pagesRoutes} from "../../../routes/routes.js";
import utils from "../../../utils/utils.js";

function backButtonController() {
    const backButton = document.querySelector('.back_button');
    backButton.addEventListener('click', () => {
        window.location.replace(pagesRoutes["/projects"]);
    });
}

async function onPageLoad() {
    await utils.components.loadComponents();
    backButtonController()
}

await onPageLoad();



