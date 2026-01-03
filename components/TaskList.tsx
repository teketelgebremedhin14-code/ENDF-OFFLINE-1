import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onToggle, onUpdate }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No tasks found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onDelete={onDelete} 
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TaskList;