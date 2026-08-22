import {
  CheckSquare,
  Clock,
  Link2,
  MoreVertical,
  Edit,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
import { useNavigate } from "react-router-dom";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "../services/tasksApi";
import { toast } from "sonner";

export function TaskCard({ task }) {
  const navigate = useNavigate();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const difficultyLabel = (d) => {
    if (d >= 4) return "Hard";
    if (d === 3) return "Medium";
    return "Easy";
  };

  return (
    <div
      onClick={() => navigate(`/tasks/${task.task_id}/subtasks`)}
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-l-4 border-blue-500 cursor-pointer"
    >
      <div className="p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.achieved}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await updateTask({ 
                    task_id: task.task_id, 
                    achieved: !task.achieved,
                    percent_completion: !task.achieved ? 100 : 0
                  }).unwrap();
                } catch (err) {
                  toast.error("Failed to update task status");
                }
              }}
            />

            <div className="flex-1">
              <h3
                className={`text-lg font-bold mb-1 transition-colors ${
                  task.achieved
                    ? "line-through text-gray-400"
                    : "text-gray-900 group-hover:text-blue-600"
                }`}
              >
                {task.task_name}
              </h3>

              {task.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* META */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
            Difficulty: {difficultyLabel(task.difficulty)}
          </span>

          {task.depends_on_task_id && (
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              Depends on #{task.depends_on_task_id}
            </span>
          )}
        </div>

        {/* PROGRESS */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Completion</span>
            <span className="font-semibold text-blue-600">
              {Math.round(task.percent_completion)}%
            </span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${task.percent_completion}%` }}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              Created{" "}
              {task.created_at
                ? new Date(task.created_at).toLocaleDateString()
                : "—"}
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-blue-500" />
        </div>

        {/* ACTIONS */}
        <div
          className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-3 border-t border-gray-100 mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Edit task feature coming soon!");
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:bg-red-50"
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this task?")) {
                try {
                  await deleteTask(task.task_id).unwrap();
                  toast.success("Task deleted successfully");
                } catch (err) {
                  toast.error("Failed to delete task");
                }
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
