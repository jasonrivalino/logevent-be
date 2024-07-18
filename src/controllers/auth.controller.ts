import userRepository from "../repositories/user.repository";
import authMiddleware from "../middlewares/auth.middleware";
import cloudinaryUtils from "../utils/cloudinary";
import jwtUtils from "../utils/jwt";
import nodemailerUtils from "../utils/nodemailer";
import { CustomRequest } from "../utils/types";
import { oauth2Client, authorizationUrl } from "../utils/oauth";
import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { google } from "googleapis";
import { Router } from "express";

class AuthController {
  async readAllUser(req: Request, res: Response) {
    try {
      const users = await userRepository.findAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async userProfile(req: Request, res: Response) {
    try {
      const customReq = req as CustomRequest;
      const id = customReq.user.id;
      if (!id) {
        return res.status(400).json({ message: "User ID not found" });
      }

      const user = await userRepository.findUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const customReq = req as CustomRequest;
      const id = customReq.user.id;
      if (!id) {
        return res.status(400).json({ message: "User ID not found" });
      }

      const user = await userRepository.findUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await userRepository.updateUser(id, { isVerified: true });
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isVerified = user.isVerified;
      if (!isVerified) {
        return res.status(401).json({ message: "Email not verified" });
      }

      const isPasswordValid = user.password ? await compare(password, user.password) : false;
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwtUtils.sign({ id: user.id });
      res.status(201).json({ token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async signUp(req: Request, res: Response) {
    try {
      const { email, password, name, phone, picture } = req.body;
      const user = await userRepository.findUserByEmail(email);
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hash(password, 10);
      const newUser = await userRepository.createUser({
        email,
        password: hashedPassword,
        name,
        phone,
        picture,
      });

      const token = jwtUtils.sign({ id: newUser.id });
      await nodemailerUtils.sendVerificationEmail(email, token);

      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = jwtUtils.sign({ id: user.id });
      await nodemailerUtils.sendPasswordResetEmail(email, token);
      res.status(200).json({ message: "Reset password email sent" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const customReq = req as CustomRequest;
      const id = customReq.user.id;
      if (!id) {
        return res.status(400).json({ message: "User ID not found" });
      }

      const user = await userRepository.findUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { name, email, password, phone, picture, isAdmin, isVerified } = req.body;
      const existingUser = email ? await userRepository.findUserByEmail(email) : null;
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const pictureUrl = picture ? await cloudinaryUtils.uploadFile(picture) : null;
      const hashedPassword = password ? await hash(password, 10) : null;
      const updatedUser = await userRepository.updateUser(id, {
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        picture: pictureUrl || user.picture,
        isAdmin: isAdmin || user.isAdmin,
        isVerified: isVerified || user.isVerified,
      });

      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async googleAuth(req: Request, res: Response) {
    try {
      res.redirect(authorizationUrl);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async googleAuthCallback(req: Request, res: Response) {
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
          email: data.email,
          password: null,
          name: data.name,
          phone: null,
          picture: null,
        });
      }

      const token = jwtUtils.sign({ id: user.id });
      const isVerified = user.isVerified;
      if (!isVerified) {
        return res.redirect(`${process.env.REACT_APP_URL}/signup?token=${token}`);
      }

      return res.redirect(`${process.env.REACT_APP_URL}/google-callback?token=${token}`);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  getRoutes() {
    return Router()
      .get("/read", this.readAllUser)
      .get("/profile", authMiddleware.authenticate, this.userProfile)
      .get("/verify", authMiddleware.authenticate, this.verifyEmail)
      .post("/signin", this.signIn)
      .post("/signup", this.signUp)
      .post("/reset-password", this.resetPassword)
      .put("/update", authMiddleware.authenticate, this.updateUser)
      .get("/google", this.googleAuth)
      .get("/google/callback", this.googleAuthCallback);
  }
}

export default new AuthController();
