import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {
    if (req.method === 'GET') {
      return res.send('Hello World from Appwrite Function!');
    }


    return res.json({
      message: 'Only GET requests are allowed'
    });

  } catch (err) {
    error(err.message);
    return res.json({ error: 'Something went wrong' });
  }
};
