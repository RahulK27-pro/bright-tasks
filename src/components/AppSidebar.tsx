import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  Settings,
  Calendar,
  Brain,
  LogOut,
  Plus
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Daily Summary", url: "/summary", icon: Calendar },
  { title: "AI Suggestions", url: "/ai-suggestions", icon: Brain },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";

  const handleLogout = () => {
    navigate('/');
  };

  const handleNewTask = () => {
    // This will be handled by a global context/state later
    window.dispatchEvent(new CustomEvent('openNewTaskDialog'));
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-border bg-card transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="px-2 py-4">
        {/* Header */}
        <div className={`mb-6 px-3 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed ? (
            <h2 className="text-lg font-semibold text-foreground">Task Scheduler</h2>
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TS</span>
            </div>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="mb-4 px-1">
          <Button
            onClick={handleNewTask}
            variant="hero"
            size={collapsed ? "icon" : "default"}
            className={`w-full ${collapsed ? 'justify-center' : 'justify-start'}`}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">New Task</span>}
          </Button>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive })}`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout */}
        <div className="px-1 mt-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={`w-full text-muted-foreground hover:text-foreground ${
              collapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}