import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { Trash2, Calendar, AlertCircle, Edit2, Check, X, Save } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggle, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = () => {
    // If completed status changed manually via select, ensure boolean reflects it
    const isNowCompleted = editedTask.status === 'completed';
    const finalTask = {
        ...editedTask,
        isCompleted: isNowCompleted
    };
    onUpdate(finalTask);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border-l-4 border-blue-500 rounded-md shadow-sm p-4 animate-in fade-in duration-200">
        <div className="space-y-3">
          {/* Title Edit */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleEditChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description Edit */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleEditChange}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Due Date Edit */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={editedTask.dueDate}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Priority Edit */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Priority</label>
              <select
                name="priority"
                value={editedTask.priority}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Status Edit */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select
                name="status"
                value={editedTask.status}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={cancelEdit}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Save size={16} className="mr-1" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        task.isCompleted ? 'opacity-75 bg-gray-50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="pt-1">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onToggle(task.id)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold truncate ${
                task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
            <p
              className={`mt-1 text-sm ${
                task.isCompleted ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
            
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              
              <span
                className={`px-2 py-0.5 rounded-full font-medium uppercase text-[10px] tracking-wide ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority} Priority
              </span>

              {task.status !== 'pending' && !task.isCompleted && (
                 <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium uppercase text-[10px] tracking-wide">
                   {task.status}
                 </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Task"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;