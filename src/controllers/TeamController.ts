import type { Request, Response } from "express";
import User from "../models/User";

export class TeamController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email }).select(
      "_id name lastName email"
    );

    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    res.json(user);
  };

  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    // Find user
    const user = await User.findById(id).select("_id");

    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    if (req.project.manager.toString() === user.id.toString()) {
      const error = new Error(
        "El Usuario no puede agregarse como Colaborador del Proyecto porque ya su Mánager"
      );
      res.status(409).json({ error: error.message });
      return;
    }

    if (
      req.project.team.some(member => member.toString() === user.id.toString())
    ) {
      const error = new Error(
        "El usuario ya está agregado como Colaborador del Proyecto"
      );
      res.status(409).json({ error: error.message });
      return;
    }

    req.project.team.push(user.id);
    await req.project.save();

    res.send("Usuario agregado correctamente");
  };
}
