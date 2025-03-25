import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { validateProjectExists } from "../middlewares/project";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";

const router = Router();

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
router.post(
  "/:projectId/tasks",
  param("projectId").isMongoId().withMessage("ID de Proyecto no válido"),
  handleInputErrors,
  validateProjectExists,
  TaskController.createTask
);

export default router;
