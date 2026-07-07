// src/components/NoteForm.tsx
import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Note, NoteCategory } from '../types';

type Props = {
  initialNote?: Note | null;
  onSaved: (note: Note) => void;
  onError: (msg: string) => void;
};

export default function NoteForm({ initialNote, onSaved, onError }: Props) {
  const isEdit = !!initialNote;

  const [title, setTitle] = React.useState(initialNote?.title ?? '');
  const [body, setBody] = React.useState(initialNote?.body ?? '');
  const [category, setCategory] = React.useState<NoteCategory>(
    initialNote?.category ?? 'todo'
  );
  const [triggerDateTime, setTriggerDateTime] = React.useState(
    initialNote?.triggerDateTime ?? ''
  );
  
const nowLocal = React.useMemo(() => {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16); 
}, []);

  React.useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setBody(initialNote.body);
      setCategory(initialNote.category);
      setTriggerDateTime(initialNote.triggerDateTime ?? '');
    } else {
      setTitle('');
      setBody('');
      setCategory('todo');
      setTriggerDateTime('');
    }
  }, [initialNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      onError('Please fill all required fields.');
      return;
    }

    if (
      (category === 'reminder' || category === 'birthday') &&
      !triggerDateTime
    ) {
      onError('Please select date and time.');
      return;
    }

    const note: Note = isEdit
      ? {
          ...initialNote!,
          title: title.trim(),
          body: body.trim(),
          category,
          triggerDateTime,
        }
      : {
          id: crypto.randomUUID(),
          title: title.trim(),
          body: body.trim(),
          category,
          triggerDateTime,
        };

    onSaved(note);

    if (!isEdit) {
      setTitle('');
      setBody('');
      setCategory('todo');
      setTriggerDateTime('');
    }
    
if (triggerDateTime) {
  const selected = new Date(triggerDateTime);
  if (selected.getTime() < Date.now()) {
    onError('Selected date & time must be in the future.');
    return;
  }
}

  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: 520 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {isEdit ? 'Edit Note' : 'Create a new Note'}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <TextField
          label="Notes"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          fullWidth
          multiline
          minRows={3}
        />

        <FormControl>
          <FormLabel>Note Category</FormLabel>
          <RadioGroup
            row
            value={category}
            onChange={(e) => setCategory(e.target.value as NoteCategory)}
          >
            <FormControlLabel value="todo" control={<Radio />} label="To Do" />
            <FormControlLabel value="reminder" control={<Radio />} label="Reminder" />
            <FormControlLabel value="birthday" control={<Radio />} label="Birthday" />
          </RadioGroup>
        </FormControl>

        {(category === 'todo' || category === 'reminder' || category === 'birthday') && (
         
<TextField
  label="Date & Time"
  type="datetime-local"
  value={triggerDateTime}
  onChange={(e) => setTriggerDateTime(e.target.value)}
  InputLabelProps={{ shrink: true }}
  inputProps={{ min: nowLocal }}
  required
/>

        )}

        <Button type="submit" variant="contained">
          {isEdit ? 'Update' : 'Submit'}
        </Button>
      </Stack>
    </Box>
  );
}