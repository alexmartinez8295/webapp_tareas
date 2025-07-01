import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function TasksPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({}); // Change to object to store tasks by status
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [allProjects, setAllProjects] = useState([]); // State to store all projects
  const [selectedProjectId, setSelectedProjectId] = useState(projectId); // State for selected project in new task dialog

  const statuses = [t('To Do'), t('In Progress'), t('Done')]; // Define task statuses

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
    fetchAllProjects(); // Fetch all projects when component mounts
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
      navigate('/projects');
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`);
      const organizedTasks = {};
      statuses.forEach(status => {
        organizedTasks[status] = response.data.filter(task => task.status === status);
      });
      setTasks(organizedTasks);
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
    setSelectedProjectId(projectId); // Reset selected project to current project
  };

  const handleAddTask = async () => {
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        title: newTaskTitle,
        description: newTaskDescription,
        project: selectedProjectId, // Use selectedProjectId
        status: 'To Do', // Default status for new tasks
      });
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column (optional, not implemented here)
      return;
    }

    const sourceColumn = tasks[source.droppableId];
    const destinationColumn = tasks[destination.droppableId];
    const draggedTask = sourceColumn.find(task => String(task._id) === draggableId);

    if (!draggedTask) {
      return;
    }

    // Optimistic update
    const newSourceColumn = Array.from(sourceColumn);
    newSourceColumn.splice(source.index, 1);

    const newDestinationColumn = Array.from(destinationColumn);
    newDestinationColumn.splice(destination.index, 0, { ...draggedTask, status: destination.droppableId });

    setTasks({
      ...tasks,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestinationColumn,
    });

    // API call to update status
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert optimistic update if API call fails
      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destinationColumn,
      });
    }
  };

  if (loading || !project) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('Tasks for')} {project.name}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ mr: 2 }}>
        {t('Add New Task')}
      </Button>
      <Button variant="outlined" onClick={() => navigate('/projects')}>
        {t('Back to Projects')}
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', p: 2 }}>
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minWidth: 280,
                    flexShrink: 0,
                    p: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid', // Use theme's border color
                    borderColor: 'primary.main',
                    boxShadow: '0 0 8px rgba(0, 255, 0, 0.7)', // Green glow
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>{t(status)}</Typography>
                  {tasks[status] && tasks[status].map((task, index) => (
                    <Draggable draggableId={String(task._id)} index={index} key={task._id}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => navigate(`/tasks/${task._id}`)}
                          sx={{
                            p: 1.5,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'secondary.main',
                            boxShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
                            cursor: 'pointer', // Indicate it's clickable
                          }}
                        >
                          <Typography variant="subtitle1">{task.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%', // Ensure it respects the parent's width
                          }}>
                            {task.description}
                          </Typography>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
}

export default TasksPage;
