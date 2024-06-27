import userRepository from "../repositories/user.repository";
import jwtUtil from "../utils/jwt";
import { oauth2Client, authorizationUrl } from "../utils/oauth";
import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { google } from "googleapis";
import { Router } from "express";

class AuthController {
  async readUsers(req: Request, res: Response) {
    console.log("readUsers");
    const users = await userRepository.findAllUsers();
    res.json(users);
  }

  async googleAuth(req: Request, res: Response) {
    console.log("googleAuth");
    res.redirect(authorizationUrl);
  }

  async googleAuthCallback(req: Request, res: Response) {
    console.log("googleAuthCallback");
    try {
      const { code } = req.query;
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });

      const { data } = await oauth2.userinfo.get();

      if (!data.email || !data.name) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      let user = await userRepository.findUserByEmail(data.email);

      if (!user) {
        user = await userRepository.createUser({
          name: data.name,
          email: data.email,
          password: null
        });
      }

      const token = jwtUtil.sign({ id: user.id });

      res.json({ token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    console.log("signIn");
    const { email, password } = req.body;
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = user.password ? await compare(password, user.password) : false;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwtUtil.sign({ id: user.id });

    res.json({ token });
  }

  async signUp(req: Request, res: Response) {
    console.log("signUp");
    const { email, password } = req.body;
    const user = await userRepository.findUserByEmail(email);

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await userRepository.createUser({
      name: null,
      email, 
      password: hashedPassword
    });

    res.json(newUser);
  }

  getRoutes() {
    return Router()
      .get("/", this.readUsers)
      .get("/google", this.googleAuth)
      .get("/google/callback", this.googleAuthCallback)
      .post("/signin", this.signIn)
      .post("/sigup", this.signUp);
  }
}

export default new AuthController();
