import {Requests} from "../../../api/requests/requests.js";
import utils from "../../../utils/utils.js";
import * as routes from "../../../routes/routes.js";

function logoutButtonController() {
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "http://localhost:63342/go_task_tracker/front/pkg/internal/auth/login/page.html";
    });
}



async function getUsersProjects(token) {
    let response = await Requests.ProjectRequests.get({
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    if (response.status > 200) {
        console.log("error")
        return
    }

    return response.data.data["projects_list"]
}

    function addProjectsToPage(projectsList) {
        const projectsContainer = document.querySelector('.passports_container');

        projectsList.forEach(project => {
            const div = document.createElement('div');
            div.classList.add('project_passport');
            div.setAttribute('data-include', '../../../components/project/all_projects/project_passport.html');

            div.dataset.id = project.id;

            projectsContainer.appendChild(div);
        });
    }


    async function onPageLoad() {
        const token = utils.cookie.getCookie('auth_token');
        if (!token) {
            window.location.href = routes.pagesRoutes["/login"];
        }

        let projectsList = await getUsersProjects(token)
        console.log(projectsList)
        addProjectsToPage(projectsList)
        await utils.components.loadComponents();
        logoutButtonController();

    }

    await onPageLoad();


