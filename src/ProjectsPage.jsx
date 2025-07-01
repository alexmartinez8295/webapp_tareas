import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

function ProjectsPage() {
  const { token, loading } = useAuth();
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      fetchProjects();
    }
  }, [token, loading]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  const handleAddProject = async () => {
    try {
      console.log('Attempting to add project. Token:', axios.defaults.headers.common['x-auth-token']);
      await axios.post('http://localhost:5000/api/projects', {
        name: newProjectName,
        description: newProjectDescription,
      });
      fetchProjects();
      handleClose();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('Projects')}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {t('Add New Project')}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Add New Project')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('Project Name')}
            type="text"
            fullWidth
            variant="standard"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <TextField
            margin="dense"
            label={t('Description')}
            type="text"
            fullWidth
            variant="standard"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('Cancel')}</Button>
          <Button onClick={handleAddProject}>{t('Add')}</Button>
        </DialogActions>
      </Dialog>

      <Box mt={4} sx={{ overflowX: 'auto' }}>
        {projects.length === 0 ? (
          <Typography>{t('No projects yet. Add one to get started!')}</Typography>
        ) : (
          <List>
            {projects.map((project) => (
              <Paper key={project._id} sx={{ mb: 2, p: 2 }}>
                <ListItem button onClick={() => handleProjectClick(project._id)} disablePadding>
                  <ListItemText
                    primary={<Typography variant="h6">{project.name}</Typography>}
                    secondary={project.description}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}

export default ProjectsPage;