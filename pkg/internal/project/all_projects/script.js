import {Requests} from "../../../api/requests/requests.js";
import {pagesRoutes} from "../../../routes/routes.js";
import utils from "../../../utils/utils.js";

async function getProjects() {
    try {
        const response = await Requests.ProjectRequests.getByUserId();
        return response.data.data["projects_list"];
    } catch (error) {
        if (error.response?.status === 401) {
            window.location.replace(pagesRoutes["/login"]);
        }
        alert(error.message);
        return null;
    }
}


function logout() {
    Requests.AuthRequests.logout()
        .then(response => {

        })
        .catch(error => {
            alert(error.message);
        });
    window.location.replace(pagesRoutes["/login"]);
}

async function printProjects(projectsList) {
    const projectsContainer = document.querySelector('.passports_container');

    // создаём все контейнеры
    projectsList.forEach(project => {
        const div = document.createElement('div');
        div.classList.add('project_passport');
        div.setAttribute('data-include', '../../../components/project/all_projects/project_passport.html');
        div.dataset.id = project.id;
        projectsContainer.appendChild(div);
    });

    await utils.components.loadComponents();

    projectsList.forEach(project => {
        const div = projectsContainer.querySelector(`[data-id="${project.id}"]`);
        const name = div.querySelector('.project-name');
        if (name) name.textContent = project.name;
    });
}

function createProjectControllerButtonController() {
    const backButton = document.querySelector('.add-card');
    backButton.addEventListener('click', () => {
        window.location.replace(pagesRoutes["/create-project"]);
    });
}

function logoutButtonController() {
    const logoutBtn = document.querySelector('.logout_button');
    logoutBtn.addEventListener('click', () => {
        logout();
    });
}

async function onPageLoad() {
    await utils.components.loadComponents();
    let projects = await getProjects();
    if (projects){
        await printProjects(projects)
    }


    logoutButtonController()
    createProjectControllerButtonController()
}

await onPageLoad();



