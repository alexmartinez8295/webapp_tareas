import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectsAndTasks();
  }, []);

  const fetchProjectsAndTasks = async () => {
    try {
      setLoading(true);
      const projectsResponse = await axios.get('http://localhost:5000/api/projects');
      const fetchedProjects = projectsResponse.data;

      const projectsWithProgress = await Promise.all(
        fetchedProjects.map(async (project) => {
          const tasksResponse = await axios.get(`http://localhost:5000/api/tasks/project/${project._id}`);
          const tasks = tasksResponse.data;

          const totalTasks = tasks.length;
          const completedTasks = tasks.filter(task => task.status === 'Done').length;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return { ...project, totalTasks, completedTasks, progress };
        })
      );
      setProjects(projectsWithProgress);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects and tasks for dashboard:', error);
      setLoading(false);
    }
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
        {t('Dashboard')}
      </Typography>
      {
        projects.length === 0 ? (
          <Typography>{t('No projects to display on dashboard.')}</Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {projects.map((project) => (
              <Paper key={project._id} sx={{ p: 2 }}>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">{project.description}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">{t('Progress')}: {project.completedTasks}/{project.totalTasks} ({project.progress.toFixed(0)}%)</Typography>
                  <LinearProgress variant="determinate" value={project.progress} sx={{ mt: 1 }} />
                </Box>
              </Paper>
            ))}
          </Box>
        )
      }
    </Box>
  );
};

export default DashboardPage;
