export const config = () => ({
  ADZUNA_APP_ID: process.env.ADZUNA_APP_ID,
  ADZUNA_API_KEY: process.env.ADZUNA_API_KEY,
  PORT: parseInt(process.env.PORT, 10) || 3000,
});
