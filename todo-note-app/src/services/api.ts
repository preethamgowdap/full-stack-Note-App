const BASE_URL = "https://localhost:7116/api";

export const api = {
  register: async (username: string, password: string) => {
   const url ='https://localhost:7116/api/auth/register';
    const option =  {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };
    const response = fetch(url,option);
    
    return response;
  },

  login: async (username: string, password: string) => {
    const url ='https://localhost:7116/api/auth/login';
    const option =  {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };
    const response = fetch(url,option);
    
    return response;
  },

  getNotes: async (userId : string) => {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/notes/${userId}`, {
      method: "Get",
      headers: { "Authorization": `Bearer ${token}`}
      
    });
  },

  addNote: async (title: string, content: string, category:string,triggerDateTime: string,userId: string) => {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${token}`},
      body: JSON.stringify({ title:title,body: content, category: category,triggerDateTime:triggerDateTime,userId:userId }),
    });
  },

  updateNote: async(id:string,note:any) => {
    debugger;
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/notes/${id}`;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${token}`},
      body: JSON.stringify({
        id: id,
        title:note.title,
        body: note.body, 
        category: note.category,
        triggerDateTime:note.triggerDateTime,
        userId: note.userId 
      })
    }
    console.log(note);
    
    const response = await fetch(url,requestOptions);
    return response;
  },

  deleteNote: async(id: string) => {
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/notes/${id}`,{
      method:"DELETE",
      headers:{"Authorization":`Bearer ${token}`}
    });
  },
};