// src/App.tsx
 import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  CssBaseline,
  Container,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Logout } from '@mui/icons-material';
import { AccountCircle, AddCircle, Save } from '@mui/icons-material';
import MynoteCard from './components/Card';
import NoteForm from './components/NoteForm';
import type { Note } from './types';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { api } from './services/api';

type View = 'notes' | 'create';

function scheduleAlert(note: Note) {
  if (!note.triggerDateTime) return;

  const triggerTime = new Date(note.triggerDateTime).getTime();
  const delay = triggerTime - Date.now();

  if (delay <= 0) return; // prevent past alerts

  setTimeout(() => {
    alert(`${note.category}\n\n${note.title}\n\n${note.body}`);
  }, delay);
}

const App: React.FC = () => {
  const [isLoggedin,setIsLoggedIn] = useState(!! localStorage.getItem('token'));

  const username = localStorage.getItem("username");
   const userId = localStorage.getItem("userId");

  const [anchorE1, setAnchorE1] = useState<null | HTMLElement>(null);

  const handleCloseMenu = () => {
    setAnchorE1(null);
  };
 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  setIsLoggedIn(false);
  window.location.href = "/";
  };

  const [handleOpen, setHandleOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('notes');  
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    if(isLoggedin && userId){
      api.getNotes(userId).then((res) => {
        if(!res.ok)throw new Error("Failed to fetch Notes");
        return res.json();
      })
      .then((data) =>{ setNotes(data);
      })
      .catch((err) =>  console.error("Error loading notes:",err));
    }

  },[isLoggedin,userId]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editOpen, setEditOpen] = useState(false);              

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  });

  const toggleDrawer = (open: boolean) => () => setHandleOpen(open);

  
  const handleSelect = (view: View) => {                       
    setActiveView(view);
    setHandleOpen(false);
  };

  
  const handleSaved = async (note: Note) => {
  if (!editingNote && userId) {
    try {
      const res = await api.addNote(
        note.title,
        note.body,
        note.category,
        note.triggerDateTime || "",
        userId
      );

      if (res.ok) {
        const realserverNote = await res.json();
        setNotes(prev => [realserverNote, ...prev]);
        setToast({ open: true, message: 'Note saved!', severity: 'success' });
        setActiveView('notes');
        scheduleAlert(realserverNote);
      } else {
        const errorData = (await res.json()) as {
          message?: string;
          errors?: Record<string, string[]>;
        };

        let errorMessage = 'Failed to save note';

        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0]?.[0];
          if (firstError) errorMessage = firstError;
        }

        setToast({ open: true, message: errorMessage, severity: 'error' });
      }
    } catch (error) {
      console.error("Failed to save note to server:", error);
      setToast({ open: true, message: 'Network error occured', severity: 'error' });
    }
  } 
  else if (editingNote && userId && editingNote.id) {
    try {
      const res = await api.updateNote(editingNote.id, note);

      if (res.ok) {
        setNotes(prev =>
          prev.map(n => (n.id === note.id ? { ...n, ...note } : n))
        );
        setToast({ open: true, message: 'Note Updated!', severity: 'success' });
        scheduleAlert(note);
        setEditOpen(false);
        setEditingNote(null);
      } else {
        const errorData = (await res.json()) as {
          message?: string;
          errors?: Record<string, string[]>;
        };

        let errorMessage = 'Failed to update note';

        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0]?.[0];
          if (firstError) errorMessage = firstError;
        }

        setToast({ open: true, message: errorMessage, severity: 'error' });
      }
    } catch (error) {
      console.error("Failed to update note on server:", error);
      setToast({ open: true, message: 'Network error occured', severity: 'error' });
    }
  }
};

  const handleError = (msg: string) => {
    setToast({ open: true, message: msg, severity: 'error' });
  };

    const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditOpen(true);               
  };

    const handleDelete = async (id: string) => {
    try {
      
      const response = await api.deleteNote(id);

      
      if (response.ok) {
        setNotes(prev => prev.filter(n => n.id !== id));
        setToast({ open: true, message: 'Note deleted permanently.', severity: 'success' });
      } else {
        
        setToast({ open: true, message: 'Failed to delete note from database.', severity: 'error' });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setToast({ open: true, message: 'Network error occurred.', severity: 'error' });
    }
  };
  
if (!isLoggedin) {
  if (window.location.pathname === '/register') {
    return <Register />;
  }
  return <Login />;
}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />

      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(!handleOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">MY NOTES</Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{username}</Typography>
            <IconButton color ="inherit" onClick ={handleCloseMenu}>
            <AccountCircle />
            </IconButton>
            <IconButton color="inherit"  onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left-side Drawer */}
      <Drawer
        anchor="left"
        open={handleOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 240, boxSizing: 'border-box', marginTop: '64px',
            backgroundColor: 'primary.main', color: 'white',
          },
        }}
      >
        <MenuList>
          <MenuItem selected={activeView === 'notes'} onClick={() => handleSelect('notes')}>
            <ListItemIcon><Save fontSize="small" sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText>MY NOTES</ListItemText>
          </MenuItem>

          <MenuItem selected={activeView === 'create'} onClick={() => handleSelect('create')}>
            <ListItemIcon><AddCircle fontSize="small" sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText>Create Note</ListItemText>
          </MenuItem>
        </MenuList>
      </Drawer>

      
      <Toolbar />
      <Container sx={{ py: 3}}>
        {activeView === 'notes' && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>My Notes</Typography>

            {notes.length === 0 ? (
              <Typography >No notes yet. Click “Create Note” to add one.</Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2 }}>
                {notes.map((n) => (
                  <MynoteCard key={n.id} note={n} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </Box>
            )}
          </Box>
        )}

        {activeView === 'create' && (
          <Box>
            <NoteForm onSaved={handleSaved} onError={handleError} />
          </Box>
        )}
      </Container>

     
      <Dialog open={editOpen} onClose={() => { setEditOpen(false); setEditingNote(null); }} fullWidth maxWidth="sm">
        
        <DialogContent sx={{ pt: 2 }}>
          {editingNote && (
            <NoteForm initialNote={editingNote} onSaved={handleSaved} onError={handleError} />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;