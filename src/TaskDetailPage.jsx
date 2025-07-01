import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TaskDetailPage = () => {
  const { t } = useTranslation();
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [projects, setProjects] = useState([]); // State to store projects
  const [editedProject, setEditedProject] = useState(''); // State for selected project

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch task details
        const taskResponse = await axios.get(`http://localhost:5000/api/tasks/${taskId}`);
        setTask(taskResponse.data);
        setEditedTitle(taskResponse.data.title);
        setEditedDescription(taskResponse.data.description);
        setEditedDueDate(taskResponse.data.dueDate ? new Date(taskResponse.data.dueDate).toISOString().split('T')[0] : '');
        setEditedProject(taskResponse.data.project ? taskResponse.data.project._id : '');

        // Fetch projects
        const projectsResponse = await axios.get('http://localhost:5000/api/projects');
        setProjects(projectsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        // Optionally navigate back or show an error message
      }
    };

    fetchData();
  }, [taskId]);

  const handleUpdateTask = async () => {
    try {
      const updatedTask = {
        title: editedTitle,
        description: editedDescription,
        dueDate: editedDueDate,
        project: editedProject, // Include edited project
      };
      const response = await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, updatedTask);
      setTask(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating task:', error);
      // Handle error, maybe show a message to the user
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setEditedProject(task.project ? task.project._id : '');
    setEditMode(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return <Typography>{t('Task not found.')}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('Task Details')}
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        {editMode ? (
          <Box>
            <TextField
              label={t('Title')}
              fullWidth
              margin="normal"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              label={t('Description')}
              fullWidth
              margin="normal"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <TextField
              label={t('Due Date')}
              type="date"
              fullWidth
              margin="normal"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="project-select-label">{t('Project')}</InputLabel>
              <Select
                labelId="project-select-label"
                value={editedProject}
                label={t('Project')}
                onChange={(e) => setEditedProject(e.target.value)}
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleUpdateTask}>
                {t('Save')}
              </Button>
              <Button variant="outlined" onClick={handleCancelEdit}>
                {t('Cancel')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6">{t('Title')}: {task.title}</Typography>
            <Typography variant="body1" sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}>{t('Description')}: {task.description}</Typography>
            <Typography variant="body1">{t('Status')}: {t(task.status)}</Typography>
            {task.project && (
              <Typography variant="body1">{t('Project')}: {task.project.name}</Typography>
            )}
            {task.dueDate && (
              <Typography variant="body1">{t('Due Date')}: {new Date(task.dueDate).toLocaleDateString()}</Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => setEditMode(true)}>
                {t('Edit')}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      <Button variant="outlined" onClick={() => navigate(-1)}>
        {t('Back')}
      </Button>
    </Box>
  );
};

export default TaskDetailPage;
