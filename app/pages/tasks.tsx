export type Task = {
    id: number;
    title: string;
    description: string;
    status: string
    memberId: number;
  };
  
  export type TeamMember = {
    id: number;
    name: string;
    role: string
    
  };

  
  
  export const getTeamMembers = (): TeamMember[] => {
  
    if (typeof window === 'undefined') return [];
  
    const members = localStorage.getItem('teamMembers');
  
    return members ? JSON.parse(members) : [];
  
  };
  
  
  
  export const saveTeamMembers = (members: TeamMember[]): void => {
  
    if (typeof window === 'undefined') return;
  
    localStorage.setItem('teamMembers', JSON.stringify(members));
  
  };