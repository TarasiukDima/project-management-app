import React, { FC } from 'react';
import { List } from '@mui/material';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import TasksListItem from './TasksListItem';
import { ITask } from '$types/common';
import css from './TasksList.module.scss';

interface ITasksListProps {
  tasks: Array<ITask>;
  columnId: string;
}

const TasksList: FC<ITasksListProps> = ({ tasks, columnId }) => {
  return (
    <Droppable
      droppableId={columnId}
      type="TASK"
      ignoreContainerClipping={true}
      direction="vertical"
    >
      {(droppableTaskProvided: DroppableProvided) => (
        <List
          component="ul"
          className={css.tasksList}
          ref={droppableTaskProvided.innerRef}
          {...droppableTaskProvided.droppableProps}
        >
          {tasks.map((tasksItem: ITask) => (
            <Draggable key={tasksItem.id} draggableId={tasksItem.id} index={tasksItem.order}>
              {(draggableTaskProvided: DraggableProvided) => (
                <TasksListItem {...tasksItem} draggableTaskProvided={draggableTaskProvided} />
              )}
            </Draggable>
          ))}
          {droppableTaskProvided.placeholder}
        </List>
      )}
    </Droppable>
  );
};

export default TasksList;
