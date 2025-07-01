import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AllTasksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchAllProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tasks/user');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setAllProjects(response.data);
    } catch (error) {
      console.error('Error fetching all projects:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setSelectedProjectId('');
  };

  const handleAddTask = async () => {
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        title: newTaskTitle,
        description: newTaskDescription,
        project: selectedProjectId,
        status: 'To Do',
      });
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('All Tasks')}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {t('Add New Task')}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Add New Task')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('Task Title')}
            type="text"
            fullWidth
            variant="standard"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label={t('Description')}
            type="text"
            fullWidth
            variant="standard"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="project-select-label">{t('Project')}</InputLabel>
            <Select
              labelId="project-select-label"
              value={selectedProjectId}
              label={t('Project')}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <MenuItem value="">{t('None')}</MenuItem>
              {allProjects.map((proj) => (
                <MenuItem key={proj._id} value={proj._id}>
                  {proj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('Cancel')}</Button>
          <Button onClick={handleAddTask}>{t('Add')}</Button>
        </DialogActions>
      </Dialog>

      <Box mt={4}>
        {tasks.length === 0 ? (
          <Typography>{t('No tasks yet. Add one to get started!')}</Typography>
        ) : (
          <List>
            {tasks.map((task) => (
              <Paper key={task._id} sx={{ mb: 2, p: 2 }}>
                <ListItem button onClick={() => handleTaskClick(task._id)} disablePadding>
                  <ListItemText
                    primary={<Typography variant="h6">{task.title}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                        {task.project && (
                          <Typography variant="body2" color="text.secondary">{t('Project')}: {task.project.name}</Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">{t('Status')}: {t(task.status)}</Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default AllTasksPage;
