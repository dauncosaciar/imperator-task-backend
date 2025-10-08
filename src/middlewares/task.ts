import { Types } from "mongoose";
import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function validateTaskId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;

    if (!Types.ObjectId.isValid(taskId)) {
      const error = new Error("ID de Tarea no válido");
      res.status(400).json({ error: error.message });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error("Tarea no encontrada");
      res.status(404).json({ error: error.message });
      return;
    }

    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export async function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.task.project.toString() !== req.project.id.toString()) {
    const error = new Error("Esta Tarea no pertenece al Proyecto");
    res.status(400).json({ error: error.message });
    return;
  }

  next();
}

export async function hasAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user.id.toString() !== req.project.manager.toString()) {
    const error = new Error("Acción no válida");
    res.status(400).json({ error: error.message });
    return;
  }

  next();
}
