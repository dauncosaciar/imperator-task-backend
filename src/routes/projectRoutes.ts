import { Router } from "express";
import { body, param } from "express-validator";
import { authenticate } from "../middlewares/auth";
import { handleInputErrors } from "../middlewares/validation";
import { projectExists, validateProjectId } from "../middlewares/project";
import {
  taskBelongsToProject,
  taskExists,
  validateTaskId
} from "../middlewares/task";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { TeamController } from "../controllers/TeamController";

const router = Router();

router.use(authenticate);

/* Routes for Projects */
router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es obligatoria"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID de Proyecto no válido"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID de Proyecto no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es obligatoria"),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID de Proyecto no válido"),
  handleInputErrors,
  ProjectController.deleteProject
);

/* Routes for Tasks */
router.param("projectId", validateProjectId);
router.param("projectId", projectExists);

router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("El Nombre de la Tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción de la Tarea es obligatoria"),
  handleInputErrors,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.param("taskId", validateTaskId);
router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

router.get("/:projectId/tasks/:taskId", TaskController.getTaskById);

router.put(
  "/:projectId/tasks/:taskId",
  body("name").notEmpty().withMessage("El Nombre de la Tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción de la Tarea es obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete("/:projectId/tasks/:taskId", TaskController.deleteTask);

router.post(
  "/:projectId/tasks/:taskId/status",
  body("status").notEmpty().withMessage("El Estado de la Tarea es obligatorio"),
  handleInputErrors,
  TaskController.updateStatus
);

/* Routes for Teams (Collaborators) */
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("Email no válido"),
  handleInputErrors,
  TeamController.findMemberByEmail
);

router.get("/:projectId/team", TeamController.getProjectTeam);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID de Usuario no válido"),
  handleInputErrors,
  TeamController.addMemberById
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("ID de Usuario no válido"),
  handleInputErrors,
  TeamController.removeMemberById
);

export default router;
