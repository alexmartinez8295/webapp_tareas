import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const KanbanBoard = ({ projectId }) => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);

  const statuses = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

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
      console.error('KanbanBoard: Error fetching tasks:', error);
      setLoading(false);
      console.log('KanbanBoard: Loading set to false due to error.');
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column (optional for now)
      return;
    }

    const sourceColumn = tasks[source.droppableId];
    const destinationColumn = tasks[destination.droppableId];
    const draggedTask = sourceColumn.find(task => task._id === draggableId);

    if (!draggedTask) {
      return;
    }

    // Optimistic update
    const newSourceColumn = Array.from(sourceColumn);
    newSourceColumn.splice(source.index, 1);

    const newDestinationColumn = Array.from(destinationColumn);
    newDestinationColumn.splice(destination.index, 0, draggedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestinationColumn,
    });

    // API call to update status
    try {
      await axios.put(`http://localhost:5000/api/tasks/${draggableId}/status`, {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
                  bgcolor: 'grey.100',
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
                        sx={{ p: 1.5, bgcolor: 'background.paper', boxShadow: 1 }}
                      >
                        <Typography variant="subtitle1">{task.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {task.project ? t('Project') + ': ' + task.project.name : ''}
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
  );
};

export default KanbanBoard;
