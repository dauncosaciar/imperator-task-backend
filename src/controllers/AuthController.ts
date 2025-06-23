import type { Request, Response } from "express";
import User from "../models/User";
import Token from "../models/Token";
import { hashPassword } from "../utils/auth";
import { generate6DigitToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Prevent duplicated users
      const userExists = await User.findOne({ email });

      if (userExists) {
        const error = new Error("El Usuario con ese email ya está registrado");
        res.status(409).json({ error: error.message });
        return;
      }

      // Create and save user
      const user = new User(req.body);
      user.password = await hashPassword(password);

      // Generate user confirmation token
      const token = new Token();
      token.token = generate6DigitToken();
      token.user = user.id;

      // Send account confirmation email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        token: token.token
      });

      await Promise.allSettled([user.save(), token.save()]);
      res.send("Cuenta creada. Revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error("Token no válido");
        res.status(401).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
