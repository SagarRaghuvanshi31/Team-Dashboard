// app/pages/api/teamMembers.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const teamMembers = [
    { id: 1, name: 'Alice', role: 'Developer', bio: 'Full-stack developer' },
    { id: 2, name: 'Bob', role: 'Designer', bio: 'UI/UX designer' },
    { id: 3, name: 'Charlie', role: 'Product Manager', bio: 'Ensures the team delivers quality' },
  ];

  res.status(200).json(teamMembers);
}
