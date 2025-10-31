import authRoutes from './entities/auth.js';
import userRoutes from './entities/user.js';
import projectRoutes from './entities/project.js';
import boardRoutes from './entities/board.js';
import columnRoutes from './entities/column.js';
import taskRoutes from './entities/task.js';

export const defaultRoute = "http://localhost:2002"

export const entitiesRoutes = {
    authRoutes,
    userRoutes,
    projectRoutes,
    columnRoutes,
    boardRoutes,
    taskRoutes,
}

