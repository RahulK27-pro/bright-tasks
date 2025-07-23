import { useState } from "react";
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review project proposal",
      description: "Go through the new client proposal and provide feedback",
      priority: "high",
      dueDate: new Date(),
      completed: false,
      createdAt: new Date(),
    },
    {
      id: "2", 
      title: "Team standup meeting",
      description: "Daily standup at 9 AM",
      priority: "medium",
      completed: false,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Update documentation",
      description: "Complete the API documentation updates",
      priority: "low",
      completed: true,
      createdAt: new Date(),
    }
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleTaskAdd = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
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

            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Suggestions
                </CardTitle>
                <CardDescription>
                  Smart recommendations to improve your productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-accent/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm">
                      🎯 <strong>Focus Time:</strong> You have 3 high-priority tasks. Consider blocking 2 hours of focus time this afternoon.
                    </p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg border-l-4 border-warning">
                    <p className="text-sm">
                      ⏰ <strong>Schedule Reminder:</strong> "Team standup meeting" is due soon but has no specific time set.
                    </p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg border-l-4 border-success">
                    <p className="text-sm">
                      📈 <strong>Great Progress:</strong> You've completed 67% more tasks this week compared to last week!
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