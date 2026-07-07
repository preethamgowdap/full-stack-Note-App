 // src/types.ts
 export type NoteCategory =
  | 'todo'
  | 'reminder'
  | 'birthday';

  
export interface Login {
  username: string;
  password: string;
}

export interface Register {
  username: string;
  password: string;
}


export type Note = {
  id: string;
  title: string;
  body: string;
  category: NoteCategory;
  triggerDateTime: string; 
};