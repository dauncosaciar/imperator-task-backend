import type { Request, Response } from "express";
import User from "../models/User";
import Token from "../models/Token";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
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
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Cuenta confirmada correctamente. Ya puedes iniciar sesión");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      // Check if user exists
      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Check if user has confirmed his account
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generate6DigitToken();
        await token.save();

        // Send account confirmation email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          token: token.token
        });

        const error = new Error(
          "La cuenta aun no ha sido confirmada, hemos enviado un email de confirmación"
        );
        res.status(401).json({ error: error.message });
        return;
      }

      // Check user password
      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error("La contraseña es incorrecta");
        res.status(401).json({ error: error.message });
        return;
      }

      // Generate JWT and send it to frontend
      const token = generateJWT({ id: user.id });
      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El Usuario con ese email no está registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Check if user is confirmed
      if (user.confirmed) {
        const error = new Error("El Usuario con ese email ya está confirmado");
        res.status(403).json({ error: error.message });
        return;
      }

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
      res.send("Se envió un nuevo token a tu email");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El Usuario con ese email no está registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Generate password reset token
      const token = new Token();
      token.token = generate6DigitToken();
      token.user = user.id;
      await token.save();

      // Send password reset token email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        token: token.token
      });

      res.send("Revisa tu email para instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }

      res.send("Token válido. Define tu nueva contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send(
        "Tu contraseña se modificó correctamente. Ya puedes iniciar sesión"
      );
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getUser = async (req: Request, res: Response) => {
    res.json(req.user);
    return;
  };

  static updateProfile = async (req: Request, res: Response) => {
    const { name, lastName, email } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists && userExists.id.toString() !== req.user.id.toString()) {
      const error = new Error("Ese email ya está en uso por otro Usuario");
      res.status(409).json({ error: error.message });
      return;
    }

    req.user.name = name;
    req.user.lastName = lastName;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Perfil actualizado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { currentPassword, password } = req.body;
    const user = await User.findById(req.user.id);
    const isPasswordCorrect = await checkPassword(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      const error = new Error("Tu contraseña actual no es correcta");
      res.status(401).json({ error: error.message });
      return;
    }

    try {
      user.password = await hashPassword(password);
      await user.save();
      res.send("Tu contraseña se modificó correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const user = await User.findById(req.user.id);
    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("Tu contraseña no es correcta");
      res.status(401).json({ error: error.message });
      return;
    }

    res.send("Contraseña correcta");
  };
}
