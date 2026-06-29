import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  Sparkles,
  Send,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Play,
  Pause,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Bell,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Wand2,
  Bot,
  Plus,
  Upload,
  Download,
  Eye,
  Trash2,
  Paperclip,
  X
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { toast } from '../../lib/toast';

interface SettlementTask {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'financial' | 'documents' | 'inspection' | 'compliance' | 'communication';
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  assignedToEmail: string;
  dueDate: Date;
  completedDate?: Date;
  dependencies: string[];
  notes: string[];
  aiGenerated: boolean;
  estimatedDuration: number; // days
  documents: TaskDocument[];
}

interface TaskDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  url?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}

interface SettlementChecklistManagerProps {
  caseData: any;
}

export function SettlementChecklistManager({ caseData }: SettlementChecklistManagerProps) {
  const [tasks, setTasks] = useState<SettlementTask[]>(generateInitialTasks(caseData));
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['legal', 'financial', 'documents']);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [showCommunicationPanel, setShowCommunicationPanel] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const categories = [
    { id: 'legal', name: 'Legal Requirements', icon: FileText, color: 'blue' },
    { id: 'financial', name: 'Financial Settlement', icon: TrendingUp, color: 'green' },
    { id: 'documents', name: 'Documentation', icon: CheckSquare, color: 'purple' },
    { id: 'inspection', name: 'Property Inspection', icon: AlertCircle, color: 'orange' },
    { id: 'compliance', name: 'Compliance & Regulatory', icon: AlertTriangle, color: 'red' },
    { id: 'communication', name: 'Party Communication', icon: MessageSquare, color: 'indigo' }
  ];

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue' || (t.status !== 'completed' && new Date(t.dueDate) < new Date())).length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const criticalTasks = tasks.filter(t => t.priority === 'critical' && t.status !== 'completed');
  const upcomingTasks = tasks.filter(t => {
    const daysUntilDue = differenceInDays(new Date(t.dueDate), new Date());
    return daysUntilDue <= 3 && daysUntilDue >= 0 && t.status !== 'completed';
  });

  // Calculate estimated completion date
  const estimatedCompletionDate = calculateEstimatedCompletion(tasks);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(c => c !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'not_started' : 'completed';
        const completedDate = newStatus === 'completed' ? new Date() : undefined;
        
        // AI notification
        if (newStatus === 'completed') {
          toast.success('Task completed!', `AI will notify ${task.assignedTo} and update dependent tasks`);
        }
        
        return { ...task, status: newStatus, completedDate };
      }
      return task;
    }));
  };

  const handleAIGenerateTasks = async () => {
    setIsGeneratingTasks(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTasks = generateAITasks(caseData);
    setTasks([...tasks, ...newTasks]);
    
    toast.success('AI Generated Additional Tasks', `Added ${newTasks.length} recommended tasks based on case analysis`);
    setIsGeneratingTasks(false);
  };

  const handleAIOptimizeTimeline = async () => {
    toast.info('AI Optimizing Timeline...', 'Analyzing task dependencies and resource allocation');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Timeline Optimized', 'Settlement timeline optimized to complete 3 days earlier');
  };

  const handleBulkCommunicate = () => {
    setShowCommunicationPanel(true);
  };

  const handleAIAutoAssign = () => {
    const updatedTasks = tasks.map(task => {
      if (task.status === 'not_started' && !task.assignedTo) {
        return {
          ...task,
          assignedTo: getAutoAssignee(task, caseData),
          assignedToEmail: getAssigneeEmail(getAutoAssignee(task, caseData), caseData)
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    toast.success('AI Auto-Assigned Tasks', 'All unassigned tasks have been assigned to appropriate parties');
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-100">{completedTasks}/{totalTasks}</div>
              <div className="text-sm text-slate-300 mt-1">Tasks Completed</div>
              <Progress value={progressPercentage} className="h-2 mt-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{inProgressTasks}</div>
              <div className="text-sm text-slate-300 mt-1">In Progress</div>
              <Clock className="w-5 h-5 text-blue-400 mx-auto mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{overdueTasks}</div>
              <div className="text-sm text-slate-300 mt-1">Overdue</div>
              <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{blockedTasks}</div>
              <div className="text-sm text-slate-300 mt-1">Blocked</div>
              <Pause className="w-5 h-5 text-orange-400 mx-auto mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-slate-300">Est. Completion</div>
              <div className="text-lg font-bold text-slate-100 mt-1">
                {format(estimatedCompletionDate, 'dd MMM yyyy')}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {differenceInDays(estimatedCompletionDate, new Date())} days
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Action Bar */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/15 rounded-full">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100">AI Settlement Assistant</h3>
                <p className="text-sm text-slate-300">Automate task creation, assignments, and communications</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddTaskModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAIGenerateTasks}
                disabled={isGeneratingTasks}
              >
                {isGeneratingTasks ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                Generate Tasks
              </Button>
              <Button variant="outline" onClick={handleAIAutoAssign}>
                <Users className="w-4 h-4 mr-2" />
                Auto-Assign
              </Button>
              <Button variant="outline" onClick={handleAIOptimizeTimeline}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Optimize Timeline
              </Button>
              <Button onClick={() => setShowAIAssistant(true)}>
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical & Upcoming Tasks Alerts */}
      {(criticalTasks.length > 0 || upcomingTasks.length > 0 || overdueTasks > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overdueTasks > 0 && (
            <Card className="border-red-500/30 bg-red-500/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-300">Overdue Tasks</h4>
                    <p className="text-sm text-red-300 mt-1">
                      {overdueTasks} task{overdueTasks > 1 ? 's' : ''} require immediate attention
                    </p>
                    <Button size="sm" variant="outline" className="mt-2" onClick={handleBulkCommunicate}>
                      Send Reminders
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {criticalTasks.length > 0 && (
            <Card className="border-orange-500/30 bg-orange-500/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-300">Critical Tasks</h4>
                    <p className="text-sm text-orange-300 mt-1">
                      {criticalTasks.length} critical task{criticalTasks.length > 1 ? 's' : ''} pending
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {upcomingTasks.length > 0 && (
            <Card className="border-yellow-500/30 bg-yellow-500/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-300">Due Soon</h4>
                    <p className="text-sm text-yellow-300 mt-1">
                      {upcomingTasks.length} task{upcomingTasks.length > 1 ? 's' : ''} due in 3 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Task Categories */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryTasks = tasks.filter(t => t.category === category.id);
          const completedCount = categoryTasks.filter(t => t.status === 'completed').length;
          const categoryProgress = (completedCount / categoryTasks.length) * 100;
          const Icon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <Card key={category.id}>
              <CardHeader 
                className="cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                    <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                      <Icon className={`w-5 h-5 text-${category.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-slate-300 mt-1">
                        {completedCount}/{categoryTasks.length} completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <Progress value={categoryProgress} className="h-2" />
                    </div>
                    <Badge variant={completedCount === categoryTasks.length ? "default" : "secondary"}>
                      {Math.round(categoryProgress)}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  <div className="space-y-3">
                    {categoryTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => toggleTaskStatus(task.id)}
                        onUpdate={(updatedTask) => {
                          setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Communication Panel */}
      {showCommunicationPanel && (
        <BulkCommunicationPanel
          tasks={tasks}
          caseData={caseData}
          onClose={() => setShowCommunicationPanel(false)}
        />
      )}

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <AIAssistantPanel
          tasks={tasks}
          caseData={caseData}
          onClose={() => setShowAIAssistant(false)}
          onTasksUpdate={setTasks}
        />
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <AddTaskModal
          caseData={caseData}
          onClose={() => setShowAddTaskModal(false)}
          onTaskAdd={(newTask) => setTasks([...tasks, newTask])}
        />
      )}
    </div>
  );
}

// Task Item Component
function TaskItem({ task, onToggle, onUpdate }: { task: SettlementTask; onToggle: () => void; onUpdate: (task: SettlementTask) => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');

  const statusColors = {
    not_started: 'bg-white/5 text-slate-300',
    in_progress: 'bg-blue-500/15 text-blue-300',
    completed: 'bg-green-500/15 text-green-300',
    blocked: 'bg-orange-500/15 text-orange-300',
    overdue: 'bg-red-500/15 text-red-300'
  };

  const priorityColors = {
    low: 'bg-white/5 text-slate-300',
    medium: 'bg-yellow-500/15 text-yellow-300',
    high: 'bg-orange-500/15 text-orange-300',
    critical: 'bg-red-500/15 text-red-300'
  };

  const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date());
  const isOverdue = daysUntilDue < 0 && task.status !== 'completed';

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedTask = {
        ...task,
        notes: [...task.notes, `${format(new Date(), 'dd MMM yyyy HH:mm')}: ${newNote}`]
      };
      onUpdate(updatedTask);
      setNewNote('');
      setIsAddingNote(false);
      toast.success('Note added');
    }
  };

  const handleSendReminder = () => {
    toast.success('Reminder sent', `Email sent to ${task.assignedTo}`);
  };

  return (
    <div className={`border rounded-lg p-4 ${isOverdue ? 'border-red-300 bg-red-500/10' : 'border-white/10 bg-white'}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === 'completed'}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={`font-semibold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {task.title}
                </h4>
                {task.aiGenerated && (
                  <Badge variant="outline" className="text-purple-400 border-purple-300">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-300 mt-1">{task.description}</p>
              
              <div className="flex items-center gap-3 mt-3">
                <Badge className={statusColors[task.status]}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={priorityColors[task.priority]}>
                  {task.priority.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-slate-300">
                  <Users className="w-4 h-4" />
                  {task.assignedTo}
                </div>
                <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-400 font-semibold' : 'text-slate-300'}`}>
                  <Calendar className="w-4 h-4" />
                  {isOverdue ? 'OVERDUE: ' : ''}{format(task.dueDate, 'dd MMM yyyy')}
                  {!isOverdue && daysUntilDue <= 3 && ` (${daysUntilDue} days)`}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSendReminder}
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Details'}
              </Button>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <div>
                <p className="text-sm font-semibold text-slate-300 mb-1">Assigned To:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{task.assignedToEmail}</span>
                </div>
              </div>

              {task.dependencies.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-300 mb-1">Dependencies:</p>
                  <ul className="text-sm text-slate-300 list-disc list-inside">
                    {task.dependencies.map((dep, idx) => (
                      <li key={idx}>{dep}</li>
                    ))}
                  </ul>
                </div>
              )}

              {task.notes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-300 mb-1">Notes:</p>
                  <div className="space-y-2">
                    {task.notes.map((note, idx) => (
                      <p key={idx} className="text-sm text-slate-300 bg-white/5 p-2 rounded">
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {isAddingNote ? (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddNote}>Save Note</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsAddingNote(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsAddingNote(true)}>
                  Add Note
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Bulk Communication Panel
function BulkCommunicationPanel({ tasks, caseData, onClose }: { tasks: SettlementTask[]; caseData: any; onClose: () => void }) {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [subject, setSubject] = useState('');

  const recipients = Array.from(new Set(tasks.map(t => t.assignedTo))).map(name => {
    const task = tasks.find(t => t.assignedTo === name);
    return { name, email: task?.assignedToEmail || '' };
  });

  const handleAIGenerateMessage = (type: 'reminder' | 'update' | 'urgent') => {
    let message = '';
    let subjectLine = '';

    if (type === 'reminder') {
      subjectLine = `Settlement Reminder: ${caseData.caseNumber}`;
      message = `Dear Team,\n\nThis is a friendly reminder regarding the upcoming settlement for ${caseData.caseNumber}.\n\nYou have tasks due soon that require your attention:\n\n`;
      selectedRecipients.forEach(recipient => {
        const recipientTasks = tasks.filter(t => t.assignedTo === recipient && t.status !== 'completed');
        message += `${recipient}:\n`;
        recipientTasks.forEach(task => {
          message += `- ${task.title} (Due: ${format(task.dueDate, 'dd MMM yyyy')})\n`;
        });
        message += '\n';
      });
      message += `Please ensure these tasks are completed on time to avoid delays.\n\nBest regards,\nGrow MIP Settlement Team`;
    } else if (type === 'update') {
      subjectLine = `Settlement Progress Update: ${caseData.caseNumber}`;
      const completedCount = tasks.filter(t => t.status === 'completed').length;
      const totalCount = tasks.length;
      message = `Dear Team,\n\nSettlement progress update for ${caseData.caseNumber}:\n\n`;
      message += `âœ“ Progress: ${completedCount}/${totalCount} tasks completed (${Math.round((completedCount/totalCount)*100)}%)\n`;
      message += `âœ“ On track for settlement completion\n\n`;
      message += `Please continue to work on your assigned tasks to maintain our timeline.\n\nBest regards,\nGrow MIP Settlement Team`;
    } else if (type === 'urgent') {
      subjectLine = `URGENT: Settlement Action Required - ${caseData.caseNumber}`;
      message = `Dear Team,\n\nâš ï¸ URGENT ACTION REQUIRED\n\nThe following tasks are overdue or critically important for ${caseData.caseNumber}:\n\n`;
      const urgentTasks = tasks.filter(t => (t.status === 'overdue' || t.priority === 'critical') && t.status !== 'completed');
      urgentTasks.forEach(task => {
        message += `- ${task.title} (Assigned: ${task.assignedTo})\n`;
        message += `  Status: ${task.status.toUpperCase()}\n`;
        message += `  Due: ${format(task.dueDate, 'dd MMM yyyy')}\n\n`;
      });
      message += `Please address these immediately to prevent settlement delays.\n\nBest regards,\nGrow MIP Settlement Team`;
    }

    setSubject(subjectLine);
    setMessageTemplate(message);
  };

  const handleSendMessages = () => {
    toast.success('Messages sent!', `Emails sent to ${selectedRecipients.length} recipient${selectedRecipients.length > 1 ? 's' : ''}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bulk Communication</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>Ã—</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Quick Actions */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Message Templates
            </h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleAIGenerateMessage('reminder')}>
                Generate Reminder
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAIGenerateMessage('update')}>
                Generate Update
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAIGenerateMessage('urgent')}>
                Generate Urgent Alert
              </Button>
            </div>
          </div>

          {/* Recipients */}
          <div>
            <Label className="mb-3 block">Select Recipients</Label>
            <div className="grid grid-cols-2 gap-3">
              {recipients.map(recipient => (
                <label key={recipient.email} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-white/5">
                  <Checkbox
                    checked={selectedRecipients.includes(recipient.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRecipients([...selectedRecipients, recipient.name]);
                      } else {
                        setSelectedRecipients(selectedRecipients.filter(r => r !== recipient.name));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{recipient.name}</div>
                    <div className="text-xs text-slate-300">{recipient.email}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
            />
          </div>

          {/* Message */}
          <div>
            <Label>Message</Label>
            <Textarea
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              rows={12}
              placeholder="Type your message or use AI to generate one..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSendMessages} disabled={selectedRecipients.length === 0 || !messageTemplate}>
              <Send className="w-4 h-4 mr-2" />
              Send to {selectedRecipients.length} Recipient{selectedRecipients.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// AI Assistant Panel
function AIAssistantPanel({ tasks, caseData, onClose, onTasksUpdate }: { 
  tasks: SettlementTask[]; 
  caseData: any; 
  onClose: () => void;
  onTasksUpdate: (tasks: SettlementTask[]) => void;
}) {
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestions = [
      'âš ï¸ 3 tasks are overdue. Consider reassigning or extending deadlines.',
      'âœ“ Document collection is on track. Financial settlement can proceed.',
      'ðŸ’¡ Borrower\'s lawyer has not responded in 48 hours. Send follow-up communication.',
      'ðŸ“… Settlement could be completed 2 days earlier if "Bank Statement Verification" is prioritized.',
      'ðŸ” NCCP compliance documents require secondary review before proceeding.',
      'âœ¨ All InfoTrack checks completed. You can now initiate final settlement discussions.'
    ];
    
    setAiSuggestions(suggestions);
    setIsAnalyzing(false);
  };

  const handleApplySuggestion = (suggestion: string) => {
    toast.success('AI Suggestion Applied', 'Tasks and timeline have been updated');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/15 rounded-lg">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle>AI Settlement Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>Ã—</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-500/30 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              AI-powered analysis of your settlement progress, identifying bottlenecks, suggesting optimizations, and automating communications.
            </p>
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Settlement...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Settlement Progress
              </>
            )}
          </Button>

          {aiSuggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">AI Recommendations</h4>
              {aiSuggestions.map((suggestion, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white">
                  <p className="text-sm text-slate-100 mb-3">{suggestion}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApplySuggestion(suggestion)}>
                      Apply
                    </Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add Task Modal
function AddTaskModal({ caseData, onClose, onTaskAdd }: { 
  caseData: any; 
  onClose: () => void;
  onTaskAdd: (task: SettlementTask) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'legal' | 'financial' | 'documents' | 'inspection' | 'compliance' | 'communication'>('legal');
  const [status, setStatus] = useState<'not_started' | 'in_progress' | 'completed' | 'blocked' | 'overdue'>('not_started');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedToEmail, setAssignedToEmail] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState(1);
  const [documents, setDocuments] = useState<TaskDocument[]>([]);

  const handleAddTask = () => {
    const newTask: SettlementTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      category,
      status,
      priority,
      assignedTo,
      assignedToEmail,
      dueDate: new Date(dueDate),
      dependencies,
      notes,
      aiGenerated,
      estimatedDuration,
      documents
    };
    onTaskAdd(newTask);
    toast.success('Task added');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add New Task</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>Ã—</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Task description..."
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'legal' | 'financial' | 'documents' | 'inspection' | 'compliance' | 'communication')}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="legal">Legal Requirements</option>
              <option value="financial">Financial Settlement</option>
              <option value="documents">Documentation</option>
              <option value="inspection">Property Inspection</option>
              <option value="compliance">Compliance & Regulatory</option>
              <option value="communication">Party Communication</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'overdue')}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <Label>Priority</Label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Assigned To */}
          <div>
            <Label>Assigned To</Label>
            <Input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Name..."
            />
          </div>

          {/* Assigned To Email */}
          <div>
            <Label>Assigned To Email</Label>
            <Input
              value={assignedToEmail}
              onChange={(e) => setAssignedToEmail(e.target.value)}
              placeholder="Email..."
            />
          </div>

          {/* Due Date */}
          <div>
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Dependencies */}
          <div>
            <Label>Dependencies</Label>
            <Textarea
              value={dependencies.join(', ')}
              onChange={(e) => setDependencies(e.target.value.split(',').map(d => d.trim()).filter(d => d))}
              rows={2}
              placeholder="Task IDs separated by commas..."
            />
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes.join('\n')}
              onChange={(e) => setNotes(e.target.value.split('\n').map(n => n.trim()).filter(n => n))}
              rows={3}
              placeholder="Notes..."
            />
          </div>

          {/* AI Generated */}
          <div>
            <Label>AI Generated</Label>
            <Checkbox
              checked={aiGenerated}
              onCheckedChange={(checked) => setAiGenerated(checked === true)}
              className="mt-1"
            />
          </div>

          {/* Estimated Duration */}
          <div>
            <Label>Estimated Duration (days)</Label>
            <Input
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Documents */}
          <div>
            <Label>Documents</Label>
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.id} className="border rounded-lg p-3 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-300" />
                      <span className="text-sm text-slate-300">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-slate-300 border-white/10">
                        {doc.status.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => setDocuments([...documents, {
                id: `doc-${Date.now()}`,
                name: 'New Document',
                type: 'pdf',
                size: 0,
                uploadedBy: 'User',
                uploadedAt: new Date(),
                status: 'pending'
              }])}>
                Add Document
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAddTask} disabled={!title || !description || !category || !status || !priority || !assignedTo || !assignedToEmail || !dueDate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Functions
function generateInitialTasks(caseData: any): SettlementTask[] {
  const baseDate = new Date();
  
  return [
    // Legal Requirements
    {
      id: 'legal-1',
      title: 'Vendor Section 32 Statement Review',
      description: 'Review and verify Vendor Statement (Section 32) for accuracy and completeness',
      category: 'legal',
      status: 'completed',
      priority: 'critical',
      assignedTo: caseData.allParties?.lenderLawyer?.name || 'Lender\'s Lawyer',
      assignedToEmail: caseData.allParties?.lenderLawyer?.email || 'lawyer@example.com',
      dueDate: addDays(baseDate, -5),
      completedDate: addDays(baseDate, -6),
      dependencies: [],
      notes: ['Reviewed and approved by legal team'],
      aiGenerated: false,
      estimatedDuration: 2,
      documents: []
    },
    {
      id: 'legal-2',
      title: 'Contract of Sale Review',
      description: 'Legal review of Contract of Sale and special conditions',
      category: 'legal',
      status: 'completed',
      priority: 'critical',
      assignedTo: caseData.allParties?.borrowerLawyer?.name || 'Borrower\'s Lawyer',
      assignedToEmail: caseData.allParties?.borrowerLawyer?.email || 'borrower-lawyer@example.com',
      dueDate: addDays(baseDate, -3),
      completedDate: addDays(baseDate, -4),
      dependencies: ['legal-1'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 2,
      documents: []
    },
    {
      id: 'legal-3',
      title: 'Title Search & Certificate',
      description: 'Conduct title search and obtain current title certificate',
      category: 'legal',
      status: 'completed',
      priority: 'high',
      assignedTo: caseData.allParties?.conveyancer?.name || 'Conveyancer',
      assignedToEmail: caseData.allParties?.conveyancer?.email || 'conveyancer@example.com',
      dueDate: addDays(baseDate, -2),
      completedDate: addDays(baseDate, -3),
      dependencies: [],
      notes: ['Title clear, no encumbrances detected'],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },
    {
      id: 'legal-4',
      title: 'Mortgage Discharge Authority',
      description: 'Obtain mortgage discharge authority from existing lender',
      category: 'legal',
      status: 'in_progress',
      priority: 'high',
      assignedTo: caseData.lenderDetails?.contact || 'Lender',
      assignedToEmail: caseData.lenderDetails?.email || 'lender@example.com',
      dueDate: addDays(baseDate, 2),
      dependencies: ['legal-2'],
      notes: ['Request sent to Commonwealth Bank'],
      aiGenerated: false,
      estimatedDuration: 3,
      documents: []
    },
    {
      id: 'legal-5',
      title: 'Transfer of Land Documentation',
      description: 'Prepare and lodge Transfer of Land documents with Land Registry',
      category: 'legal',
      status: 'not_started',
      priority: 'critical',
      assignedTo: caseData.allParties?.conveyancer?.name || 'Conveyancer',
      assignedToEmail: caseData.allParties?.conveyancer?.email || 'conveyancer@example.com',
      dueDate: addDays(baseDate, 5),
      dependencies: ['legal-3', 'legal-4'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 2,
      documents: []
    },

    // Financial Settlement
    {
      id: 'financial-1',
      title: 'Final Settlement Figure Calculation',
      description: 'Calculate final settlement amount including adjustments',
      category: 'financial',
      status: 'completed',
      priority: 'critical',
      assignedTo: caseData.allParties?.accountant?.name || 'Accountant',
      assignedToEmail: caseData.allParties?.accountant?.email || 'accountant@example.com',
      dueDate: addDays(baseDate, -1),
      completedDate: addDays(baseDate, -2),
      dependencies: [],
      notes: ['Final amount: $' + caseData.currentBid?.toLocaleString()],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },
    {
      id: 'financial-2',
      title: 'Rates & Outgoings Adjustment',
      description: 'Calculate pro-rata adjustments for council rates, water, strata fees',
      category: 'financial',
      status: 'in_progress',
      priority: 'high',
      assignedTo: caseData.allParties?.accountant?.name || 'Accountant',
      assignedToEmail: caseData.allParties?.accountant?.email || 'accountant@example.com',
      dueDate: addDays(baseDate, 1),
      dependencies: ['financial-1'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },
    {
      id: 'financial-3',
      title: 'Bank Transfer Authorization',
      description: 'Set up and authorize PEXA settlement funds transfer',
      category: 'financial',
      status: 'not_started',
      priority: 'critical',
      assignedTo: 'Financial Settlement Agent',
      assignedToEmail: 'settlement@Grow MIP.com',
      dueDate: addDays(baseDate, 4),
      dependencies: ['financial-2'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },
    {
      id: 'financial-4',
      title: 'Payout to Existing Lender',
      description: 'Process payout of existing mortgage to Commonwealth Bank',
      category: 'financial',
      status: 'not_started',
      priority: 'critical',
      assignedTo: caseData.lenderDetails?.contact || 'Existing Lender',
      assignedToEmail: caseData.lenderDetails?.email || 'lender@example.com',
      dueDate: addDays(baseDate, 5),
      dependencies: ['financial-3', 'legal-4'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },

    // Documentation
    {
      id: 'doc-1',
      title: 'Building & Pest Inspection Report',
      description: 'Obtain and review building and pest inspection report',
      category: 'documents',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Building Inspector',
      assignedToEmail: 'inspector@example.com',
      dueDate: addDays(baseDate, -7),
      completedDate: addDays(baseDate, -8),
      dependencies: [],
      notes: ['Report received, no major issues found'],
      aiGenerated: false,
      estimatedDuration: 3,
      documents: []
    },
    {
      id: 'doc-2',
      title: 'Insurance Certificate of Currency',
      description: 'Obtain current insurance certificate for the property',
      category: 'documents',
      status: 'in_progress',
      priority: 'medium',
      assignedTo: 'Insurance Broker',
      assignedToEmail: 'insurance@example.com',
      dueDate: addDays(baseDate, 3),
      dependencies: [],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 2,
      documents: []
    },
    {
      id: 'doc-3',
      title: 'Strata Documents Package',
      description: 'Collect all strata documents including meeting minutes and financial statements',
      category: 'documents',
      status: 'in_progress',
      priority: 'high',
      assignedTo: 'Strata Manager',
      assignedToEmail: 'strata@example.com',
      dueDate: addDays(baseDate, 2),
      dependencies: [],
      notes: ['Waiting on AGM minutes'],
      aiGenerated: false,
      estimatedDuration: 2,
      documents: []
    },

    // Property Inspection
    {
      id: 'inspection-1',
      title: 'Final Property Inspection',
      description: 'Conduct final walk-through inspection before settlement',
      category: 'inspection',
      status: 'not_started',
      priority: 'high',
      assignedTo: caseData.allParties?.realEstateAgent?.name || 'Real Estate Agent',
      assignedToEmail: caseData.allParties?.realEstateAgent?.email || 'agent@example.com',
      dueDate: addDays(baseDate, 4),
      dependencies: ['doc-1'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },
    {
      id: 'inspection-2',
      title: 'Keys & Access Documentation',
      description: 'Arrange collection of keys and access cards/codes',
      category: 'inspection',
      status: 'not_started',
      priority: 'medium',
      assignedTo: caseData.allParties?.realEstateAgent?.name || 'Real Estate Agent',
      assignedToEmail: caseData.allParties?.realEstateAgent?.email || 'agent@example.com',
      dueDate: addDays(baseDate, 6),
      dependencies: ['inspection-1'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },

    // Compliance
    {
      id: 'compliance-1',
      title: 'NCCP Compliance Verification',
      description: 'Verify all NCCP (National Consumer Credit Protection) requirements met',
      category: 'compliance',
      status: 'in_progress',
      priority: 'critical',
      assignedTo: 'Compliance Officer',
      assignedToEmail: 'compliance@Grow MIP.com',
      dueDate: addDays(baseDate, 1),
      dependencies: [],
      notes: ['Pre-contractual disclosure verified'],
      aiGenerated: false,
      estimatedDuration: 2,
      documents: []
    },
    {
      id: 'compliance-2',
      title: 'AML/CTF Final Check',
      description: 'Complete final AML/CTF verification before fund transfer',
      category: 'compliance',
      status: 'not_started',
      priority: 'critical',
      assignedTo: 'Compliance Officer',
      assignedToEmail: 'compliance@Grow MIP.com',
      dueDate: addDays(baseDate, 3),
      dependencies: ['compliance-1'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },

    // Communication
    {
      id: 'comm-1',
      title: 'Settlement Date Confirmation',
      description: 'Confirm settlement date with all parties',
      category: 'communication',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Settlement Coordinator',
      assignedToEmail: 'coordinator@Grow MIP.com',
      dueDate: addDays(baseDate, -10),
      completedDate: addDays(baseDate, -11),
      dependencies: [],
      notes: ['All parties confirmed for ' + format(addDays(baseDate, 7), 'dd MMM yyyy')],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    },
    {
      id: 'comm-2',
      title: 'Pre-Settlement Notice to Parties',
      description: 'Send 48-hour pre-settlement notice to all parties',
      category: 'communication',
      status: 'not_started',
      priority: 'high',
      assignedTo: 'Settlement Coordinator',
      assignedToEmail: 'coordinator@Grow MIP.com',
      dueDate: addDays(baseDate, 5),
      dependencies: ['comm-1'],
      notes: [],
      aiGenerated: false,
      estimatedDuration: 1,
      documents: []
    }
  ];
}

function generateAITasks(caseData: any): SettlementTask[] {
  const baseDate = new Date();
  
  return [
    {
      id: 'ai-1',
      title: 'Utility Account Transfer Notification',
      description: 'Notify electricity, gas, and water providers of ownership change',
      category: 'communication',
      status: 'not_started',
      priority: 'medium',
      assignedTo: caseData.borrowerName || 'Borrower',
      assignedToEmail: caseData.borrowerDetails?.email || 'borrower@example.com',
      dueDate: addDays(baseDate, 6),
      dependencies: [],
      notes: [],
      aiGenerated: true,
      estimatedDuration: 1,
      documents: []
    },
    {
      id: 'ai-2',
      title: 'Vendor Tax Clearance Certificate',
      description: 'Obtain tax clearance certificate if vendor is foreign resident',
      category: 'compliance',
      status: 'not_started',
      priority: 'high',
      assignedTo: caseData.allParties?.accountant?.name || 'Accountant',
      assignedToEmail: caseData.allParties?.accountant?.email || 'accountant@example.com',
      dueDate: addDays(baseDate, 3),
      dependencies: [],
      notes: ['AI detected potential foreign residency requirement'],
      aiGenerated: true,
      estimatedDuration: 2,
      documents: []
    },
    {
      id: 'ai-3',
      title: 'Property Manager Handover',
      description: 'Arrange handover meeting with property manager for tenancy details',
      category: 'communication',
      status: 'not_started',
      priority: 'medium',
      assignedTo: caseData.allParties?.propertyManager?.name || 'Property Manager',
      assignedToEmail: caseData.allParties?.propertyManager?.email || 'pm@example.com',
      dueDate: addDays(baseDate, 7),
      dependencies: [],
      notes: [],
      aiGenerated: true,
      estimatedDuration: 1,
      documents: []
    }
  ];
}

function getAutoAssignee(task: SettlementTask, caseData: any): string {
  // AI logic to auto-assign based on task category and available parties
  if (task.category === 'legal') {
    return caseData.allParties?.lenderLawyer?.name || 'Legal Team';
  } else if (task.category === 'financial') {
    return caseData.allParties?.accountant?.name || 'Financial Team';
  } else if (task.category === 'inspection') {
    return caseData.allParties?.realEstateAgent?.name || 'Property Agent';
  } else if (task.category === 'compliance') {
    return 'Compliance Officer';
  } else if (task.category === 'communication') {
    return 'Settlement Coordinator';
  } else {
    return caseData.allParties?.conveyancer?.name || 'Conveyancer';
  }
}

function getAssigneeEmail(name: string, caseData: any): string {
  // Find email for assignee
  const allParties = caseData.allParties || {};
  for (const party of Object.values(allParties) as any[]) {
    if (party && party.name === name) {
      return party.email || 'noreply@Grow MIP.com';
    }
  }
  return 'noreply@Grow MIP.com';
}

function calculateEstimatedCompletion(tasks: SettlementTask[]): Date {
  const incompleteTasks = tasks.filter(t => t.status !== 'completed');
  if (incompleteTasks.length === 0) {
    return new Date();
  }
  
  // Get the latest due date
  const latestDueDate = incompleteTasks.reduce((latest, task) => {
    return new Date(task.dueDate) > latest ? new Date(task.dueDate) : latest;
  }, new Date());
  
  return latestDueDate;
}
