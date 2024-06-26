import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true,
});

app.get('/', async (req: Request, res: Response) => {
  console.log('Fetching users...');
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/auth/google', (req: Request, res: Response) => {
  console.log('Redirecting to Google Auth URL...');
  res.redirect(authorizationUrl);
});

app.get('/auth/google/callback', async (req: Request, res: Response) => {
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

    let user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET!;
    const expiresIn = '1h';
    const token = jwt.sign(payload, secret, { expiresIn });

    res.json({ token });
  } catch (error) {
    console.error('Error during Google callback:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
