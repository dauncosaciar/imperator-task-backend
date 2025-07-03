import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  lastName: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "ImperatorTask <admin@imperatortask.com>",
      to: user.email,
      subject: "ImperatorTask: Confirma tu cuenta",
      text: "ImperatorTask: Confirma tu cuenta",
      html: `
        <p>¡Hola, <b>${user.name} ${user.lastName}</b>!</p>
        <p>Has creado tu cuenta en <b><i>ImperatorTask</i></b>, ya casi está todo listo, sólo debes confirmarla.</p>
        <p>Visita el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
        <p>E ingresa el código: <b>${user.token}</b></p>
        <p>Este código expira en 5 minutos.</p>
      `
    });

    console.log("Mensaje enviado:", info.messageId);
  };
}
