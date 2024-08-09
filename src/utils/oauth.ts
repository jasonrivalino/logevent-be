// src/utils/oauth.ts

// dependency modules
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});

export { oauth2Client, authorizationUrl };
