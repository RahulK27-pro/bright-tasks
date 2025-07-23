import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Brain,
  Plus,
  MoreHorizontal,
  Flag
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  reminderTime?: string;
  completed: boolean;
  createdAt: Date;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  // Gemini prioritization state
  const [prioritizing, setPrioritizing] = useState(false);
  const [prioritizedResult, setPrioritizedResult] = useState<string | null>(null);
  const [prioritizeError, setPrioritizeError] = useState<string | null>(null);

  // Fetch tasks from backend on mount
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        // Convert string dates to Date objects if needed
        setTasks(data.map((t: any) => ({
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
          completed: t.completed === 1 || t.completed === true
        })));
      });
  }, []);

  const handleTaskAdd = async (newTask: Task) => {
    // Send new task to backend
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  title: newTask.title,
  description: newTask.description,
  priority: newTask.priority,
  dueDate: newTask.dueDate ? newTask.dueDate.toISOString().slice(0, 19).replace('T', ' ') : null,
  reminderTime: newTask.reminderTime,
  completed: newTask.completed ? 1 : 0,
}),
    });
    if (res.ok) {
      // Refetch tasks from backend to keep in sync
      const updated = await fetch('/api/tasks').then(r => r.json());
      setTasks(updated.map((t: any) => ({
        ...t,
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        completed: t.completed === 1 || t.completed === true
      })));
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    // Find the target task
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    // Send update to backend
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    // Refetch tasks
    const updated = await fetch('/api/tasks').then(r => r.json());
    setTasks(updated.map((t: any) => ({
      ...t,
      dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
      completed: t.completed === 1 || t.completed === true
    })));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning"; 
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  // Call Gemini prioritize endpoint
  const handlePrioritizeTasks = async () => {
    setPrioritizing(true);
    setPrioritizeError(null);
    setPrioritizedResult(null);
    try {
      // Prepare tasks for backend (convert Date to string)
      const payload = {
        tasks: tasks.map(t => ({
          title: t.title,
          deadline: t.dueDate ? t.dueDate.toISOString() : '',
          priority: t.priority,
        }))
      };
      const res = await fetch("/api/gemini/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to get prioritization");
      const data = await res.json();
      setPrioritizedResult(data.response);
    } catch (err: any) {
      setPrioritizeError(err.message || "Unknown error");
    } finally {
      setPrioritizing(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back! Here's your productivity overview.
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {pendingTasks} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Due Today</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">
                    High priority
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productivity</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">
                    Above average
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Tasks</CardTitle>
                    <CardDescription>
                      Your latest tasks and their status
                    </CardDescription>
                  </div>
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-center space-x-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                          </h4>
                          <Badge 
                            variant={getPriorityColor(task.priority) as any}
                            className="text-xs"
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          Today
                        </div>
                      )}

                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Task Prioritization */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      AI Task Prioritization
                    </CardTitle>
                    <CardDescription>
                      Get AI-powered task prioritization based on your current tasks
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrioritizeTasks}
                    disabled={prioritizing || tasks.length === 0}
                  >
                    {prioritizing ? (
                      <span>Prioritizing...</span>
                    ) : (
                      <span>Prioritize Tasks</span>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Error display */}
                {prioritizeError && (
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <p className="text-sm text-destructive font-medium">Error: {prioritizeError}</p>
                    </div>
                  </div>
                )}
                
                {/* Prioritized tasks display */}
                {prioritizedResult && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <h4 className="font-semibold text-sm">AI Prioritization Result</h4>
                    </div>
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {prioritizedResult}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Empty state */}
                {!prioritizedResult && !prioritizeError && !prioritizing && (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">No prioritization yet</p>
                    <p className="text-xs text-muted-foreground">
                      {tasks.length === 0 
                        ? "Add some tasks first, then click 'Prioritize Tasks' to get AI recommendations"
                        : "Click 'Prioritize Tasks' to get AI-powered task prioritization"}
                    </p>
                  </div>
                )}
                
                {/* Loading state */}
                {prioritizing && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                    <p className="text-sm text-muted-foreground">Analyzing your tasks...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Smart Suggestions
                </CardTitle>
                <CardDescription>
                  Productivity tips and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-accent/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm">
                      🎯 <strong>Focus Time:</strong> You have {tasks.filter(t => t.priority === 'high' && !t.completed).length} high-priority tasks. Consider blocking focus time.
                    </p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg border-l-4 border-warning">
                    <p className="text-sm">
                      ⏰ <strong>Schedule Reminder:</strong> {tasks.filter(t => !t.dueDate && !t.completed).length} tasks need due dates.
                    </p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg border-l-4 border-success">
                    <p className="text-sm">
                      📈 <strong>Great Progress:</strong> You've completed {Math.round((completedTasks / totalTasks) * 100) || 0}% of your tasks!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>

        {/* Floating Add Button - Mobile */}
        <Button
          variant="floating"
          size="floating"
          onClick={() => setShowAddDialog(true)}
          className="md:hidden"
          aria-label="Add new task"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Add Task Dialog */}
        <AddTaskDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onTaskAdd={handleTaskAdd}
        />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;