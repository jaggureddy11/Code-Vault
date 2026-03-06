import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Plus, Calendar, CheckSquare, Square, Flame, Save, X, Trophy, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, startOfWeek, addDays } from 'date-fns';

interface Task {
  id: string;
  task_text: string;
  created_at: string;
}

interface TaskProgress {
  id: string;
  task_id: string;
  date: string;
  completed: boolean;
}

export default function TodoPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allProgress, setAllProgress] = useState<TaskProgress[]>([]);

  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskText, setEditTaskText] = useState('');

  const [loading, setLoading] = useState(true);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      date,
      dateStr,
      dayShort: format(date, 'EEE'),
      isToday: dateStr === todayStr,
    };
  });

  useEffect(() => {
    if (user) {
      loadFromLocalStorage();
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `codevault_tasks_${user?.id}` || e.key === `codevault_progress_${user?.id}`) {
        loadFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadFromLocalStorage = () => {
    try {
      const storedTasksStr = localStorage.getItem(`codevault_tasks_${user?.id}`);
      const storedProgressStr = localStorage.getItem(`codevault_progress_${user?.id}`);

      const storedTasks: Task[] = storedTasksStr ? JSON.parse(storedTasksStr) : [];
      const storedProgress: TaskProgress[] = storedProgressStr ? JSON.parse(storedProgressStr) : [];

      // Keep tasks ordered by creation date
      setTasks(storedTasks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
      setAllProgress(storedProgress);
    } catch (error: any) {
      console.error('Failed to load from storage:', error);
    } finally {
      setLoading(false);
    }

    // AGENTIC: Check for pending tasks from AI
    const pendingActionStr = localStorage.getItem('codevault_pending_action');
    if (pendingActionStr) {
      try {
        const action = JSON.parse(pendingActionStr);
        if (action.type === 'ADD_TASKS' && action.payload.tasks && Array.isArray(action.payload.tasks)) {
          const freshTasks: Task[] = action.payload.tasks.map((t: string) => ({
            id: crypto.randomUUID(),
            task_text: t,
            created_at: new Date().toISOString()
          }));

          setTasks(prev => {
            const combined = [...prev, ...freshTasks];
            // Get latest progress
            const storedProgressStr = localStorage.getItem(`codevault_progress_${user?.id}`);
            const storedProgress = storedProgressStr ? JSON.parse(storedProgressStr) : [];
            saveToLocalStorage(combined, storedProgress);
            return combined;
          });

          toast({ title: "AI Sync", description: `Added ${freshTasks.length} tasks to your list.` });
          localStorage.removeItem('codevault_pending_action');
        }
      } catch (e) {
        console.error("Failed to parse agentic action", e);
      }
    }
  };

  const saveToLocalStorage = (newTasks: Task[], newAllProgress: TaskProgress[]) => {
    if (!user) return;
    localStorage.setItem(`codevault_tasks_${user.id}`, JSON.stringify(newTasks));
    localStorage.setItem(`codevault_progress_${user.id}`, JSON.stringify(newAllProgress));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !user) return;

    try {
      const newTask: Task = {
        id: crypto.randomUUID(),
        task_text: newTaskText.trim(),
        created_at: new Date().toISOString()
      };

      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      saveToLocalStorage(newTasks, allProgress);
      setNewTaskText('');
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to add task.', variant: 'destructive' });
    }
  };

  const updateTask = (id: string) => {
    if (!editTaskText.trim()) return;
    try {
      const newTasks = tasks.map(t => t.id === id ? { ...t, task_text: editTaskText.trim() } : t);
      setTasks(newTasks);
      saveToLocalStorage(newTasks, allProgress);
      setEditingTaskId(null);
      toast({ title: 'Success', description: 'Task updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update task.', variant: 'destructive' });
    }
  };

  const deleteTask = (id: string) => {
    try {
      const newTasks = tasks.filter(t => t.id !== id);
      const newAllProgress = allProgress.filter(p => p.task_id !== id);

      setTasks(newTasks);
      setAllProgress(newAllProgress);
      saveToLocalStorage(newTasks, newAllProgress);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete task.', variant: 'destructive' });
    }
  };

  const toggleTaskCompletion = (taskId: string, targetDateStr: string) => {
    if (!user) return;
    const existingIndex = allProgress.findIndex(p => p.task_id === taskId && p.date === targetDateStr);
    const existing = existingIndex >= 0 ? allProgress[existingIndex] : null;
    const newCompletedState = existing ? !existing.completed : true;

    try {
      const newAllProgress = [...allProgress];

      if (existing) {
        newAllProgress[existingIndex] = { ...existing, completed: newCompletedState };
      } else {
        const newProgress: TaskProgress = {
          id: crypto.randomUUID(),
          task_id: taskId,
          date: targetDateStr,
          completed: newCompletedState
        };
        newAllProgress.push(newProgress);
      }

      setAllProgress(newAllProgress);
      saveToLocalStorage(tasks, newAllProgress);

    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update progress.', variant: 'destructive' });
    }
  };

  // Compute stats
  const todayProgress = allProgress.filter(p => p.date === todayStr && p.completed).length;
  const availableTasksToday = tasks.length;
  const progressPercentToday = availableTasksToday === 0 ? 0 : Math.round((todayProgress / availableTasksToday) * 100);

  // Streak logic
  let streak = 0;
  let checkDate = new Date();
  let checkStreak = true;
  while (checkStreak) {
    const dStr = format(checkDate, 'yyyy-MM-dd');
    const dayProgress = allProgress.filter(p => p.date === dStr && p.completed).length;
    const tasksOnDay = tasks.filter(t => new Date(t.created_at) <= new Date(dStr + 'T23:59:59Z'));
    const tCount = tasksOnDay.length > 0 ? tasksOnDay.length : (dStr <= todayStr && tasks.length > 0 ? tasks.length : 0);
    const percent = tCount === 0 ? 0 : Math.round((dayProgress / tCount) * 100);

    if (percent === 100 && tCount > 0) streak++;
    else if (dStr !== todayStr) checkStreak = false;
    else if (percent < 100 && dStr === todayStr) {
    } else break;

    checkDate = addDays(checkDate, -1);
    if (streak > 365) break;
  }

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex justify-center items-center bg-neutral-50 dark:bg-black">
        <div className="h-10 w-10 border-4 border-black dark:border-white border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-32 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1700px] mx-auto min-h-screen bg-neutral-50 dark:bg-black text-black dark:text-white transition-colors">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6 md:gap-8">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none text-black dark:text-white">
            TASK <span className="text-neutral-400 italic tracking-normal">SHEET</span>
          </h1>
          <p className="text-[10px] sm:text-xs font-bold opacity-60 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none p-3 px-6 border-2 border-black dark:border-white bg-white dark:bg-white/5 transition-all">
            <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">STREAK</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black italic tracking-tighter">{streak} DAYS</span>
              <Flame className={`h-4 w-4 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'opacity-20'}`} />
            </div>
          </div>
          <div className="flex-1 md:flex-none p-3 px-6 border-2 border-black dark:border-white bg-white dark:bg-white/5 transition-all">
            <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">PROGRESS</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black italic tracking-tighter">{progressPercentToday}%</span>
              <TrendingUp className={`h-4 w-4 ${progressPercentToday === 100 ? 'text-green-500' : 'opacity-20'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Task Sheet Table */}
      <div className="border-[3px] md:border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] mb-8 md:mb-10">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-[3px] md:border-b-4 border-black dark:border-white bg-neutral-100 dark:bg-white/10 text-[10px] md:text-sm">
                <th className="p-4 md:p-6 text-left font-black uppercase italic tracking-widest min-w-[180px] md:min-w-[350px] border-r-[3px] md:border-r-4 border-black dark:border-white text-black dark:text-white sticky left-0 bg-neutral-100 dark:bg-zinc-900 z-10">
                  Tasks
                </th>
                {weekDays.map(day => (
                  <th
                    key={day.dateStr}
                    className={`p-2 md:p-4 text-center min-w-[60px] md:min-w-[100px] border-r-[3px] md:border-r-4 border-black dark:border-white last:border-r-0 ${day.isToday ? 'bg-black/5 dark:bg-white/5' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${day.isToday ? 'text-black dark:text-white' : 'opacity-40'}`}>{day.dayShort}</span>
                      <span className="text-xs md:text-lg font-black italic tracking-tighter">{format(day.date, 'dd')}</span>
                    </div>
                  </th>
                ))}
                <th className="p-4 md:p-6 text-center font-black uppercase tracking-widest min-w-[80px] md:min-w-[120px]">
                  OP
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 md:p-24 text-center text-sm md:text-xl font-black uppercase italic tracking-[0.3em] opacity-10">
                    NO TASKS
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isEditing = editingTaskId === task.id;
                  return (
                    <tr
                      key={task.id}
                      className={`group border-b-[3px] md:border-b-4 border-black dark:border-white last:border-b-0 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors`}
                    >
                      <td className="p-4 md:p-6 border-r-[3px] md:border-r-4 border-black dark:border-white sticky left-0 bg-white dark:bg-black z-10">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Input
                              autoFocus
                              value={editTaskText}
                              onChange={(e) => setEditTaskText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') updateTask(task.id);
                                if (e.key === 'Escape') setEditingTaskId(null);
                              }}
                              className="h-8 md:h-10 text-xs md:text-lg font-bold rounded-none border-2 border-black dark:border-white w-full bg-white dark:bg-black text-black dark:text-white px-2"
                            />
                            <button
                              onMouseDown={(e) => { e.preventDefault(); updateTask(task.id); }}
                              className="h-8 md:h-10 px-2 md:px-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] md:text-xs border-2 border-black dark:border-white"
                            >
                              SAVE
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs md:text-xl font-black uppercase italic tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">
                            {task.task_text}
                          </span>
                        )}
                      </td>
                      {weekDays.map(day => {
                        const isCompleted = allProgress.some(p => p.task_id === task.id && p.date === day.dateStr && p.completed);
                        const isFuture = day.dateStr > todayStr;
                        return (
                          <td
                            key={day.dateStr}
                            className={`p-1 md:p-4 border-r-[3px] md:border-r-4 border-black dark:border-white last:border-r-0 text-center align-middle ${day.isToday ? 'bg-black/5 dark:bg-white/5' : ''}`}
                          >
                            <button
                              onClick={() => !isFuture && toggleTaskCompletion(task.id, day.dateStr)}
                              className={`inline-flex items-center justify-center p-1 md:p-2 transition-all ${isFuture ? 'cursor-default opacity-5' : 'hover:scale-125 active:scale-95 group/btn'}`}
                            >
                              {isCompleted ? (
                                <CheckSquare className={`h-4 w-4 md:h-8 md:w-8 text-black dark:text-white`} />
                              ) : (
                                <Square className={`h-4 w-4 md:h-8 md:w-8 ${day.isToday ? 'text-black/30 dark:text-white/30' : 'text-black/10 dark:text-white/10 group-hover/btn:text-black/40'}`} />
                              )}
                            </button>
                          </td>
                        );
                      })}
                      <td className="p-1 md:p-4 text-center">
                        <div className="flex items-center justify-center gap-1 md:gap-3">
                          <button
                            onClick={() => { setEditingTaskId(task.id); setEditTaskText(task.task_text); }}
                            className="p-1 md:p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors border border-black dark:border-white"
                          >
                            <Edit2 className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 md:p-2 hover:bg-red-600 hover:text-white transition-colors border border-black dark:border-white hover:border-red-600"
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer for Add Task */}
        <div className="p-4 md:p-6 bg-neutral-100 dark:bg-white/10 border-t-[3px] md:border-t-4 border-black dark:border-white">
          <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2 md:gap-4">
            <div className="relative flex-1">
              <Plus className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-6 md:w-6 text-black dark:text-white" />
              <Input
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="ADD NEW TASK"
                className="h-10 md:h-14 text-xs md:text-xl font-black uppercase italic tracking-tighter rounded-none border-2 md:border-[3px] border-black dark:border-white focus-visible:ring-0 focus-visible:ring-offset-0 px-10 md:px-14 font-bold bg-white dark:bg-black text-black dark:text-white transition-all w-full placeholder:opacity-20"
              />
            </div>
            <Button type="submit" className="h-10 md:h-14 px-6 md:px-10 rounded-none bg-black dark:bg-white text-white dark:text-black text-xs md:text-sm font-black uppercase italic tracking-widest border-2 md:border-[3px] border-black dark:border-white hover:bg-neutral-800 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
              ADD
            </Button>
          </form>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
        <div className="text-center md:text-left">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-0.5">STATUS</div>
          <div className="text-xl md:text-3xl font-black uppercase italic tracking-tighter">
            {progressPercentToday === 100 ? "COMPLETED" : "PENDING"}
          </div>
        </div>

        {progressPercentToday === 100 && (
          <div className="bg-black dark:bg-white text-white dark:text-black px-6 md:px-10 py-3 md:py-4 font-black uppercase italic tracking-[0.1em] border-2 md:border-[3px] border-black dark:border-white text-[10px] md:text-xs">
            <Trophy className="h-4 w-4 inline-block mr-2" /> 100% COMPLETE
          </div>
        )}
      </div>
    </div>
  );
}
