import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';

// ===== ADD CONDITION MODAL =====
interface AddConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddConditionModal = ({ isOpen, onClose }: AddConditionModalProps) => {
  const [formData, setFormData] = useState({
    description: '',
    matter: '',
    category: 'finance',
    dueDate: '',
    owner: '',
    priority: 'medium'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Condition created: ${formData.description}`);
    onClose();
    setFormData({
      description: '',
      matter: '',
      category: 'finance',
      dueDate: '',
      owner: '',
      priority: 'medium'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Add Condition</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description *</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Finance approval required"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Matter ID *</label>
              <select
                required
                value={formData.matter}
                onChange={(e) => setFormData({ ...formData, matter: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select matter...</option>
                <option value="MAT-2024-1247">MAT-2024-1247 - 123 Collins St</option>
                <option value="MAT-2024-1246">MAT-2024-1246 - 45 George St</option>
                <option value="MAT-2024-1245">MAT-2024-1245 - 78 Queen St</option>
                <option value="MAT-2024-1244">MAT-2024-1244 - 12 King William Rd</option>
                <option value="MAT-2024-1243">MAT-2024-1243 - 156 St Georges Tce</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="finance">Finance</option>
                <option value="inspection">Inspection</option>
                <option value="voi">VOI/ID</option>
                <option value="contract">Contract</option>
                <option value="title">Title</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Assigned To *</label>
            <select
              required
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select owner...</option>
              <option value="Sarah Chen">Sarah Chen</option>
              <option value="John Smith">John Smith</option>
              <option value="Lisa Wong">Lisa Wong</option>
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Emma Davis">Emma Davis</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Condition
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===== VIEW CONDITION MODAL =====
interface ViewConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  condition: {
    id: string;
    desc: string;
    matter: string;
    status: string;
    owner: string;
    due: string;
  } | null;
}

export const ViewConditionModal = ({ isOpen, onClose, condition }: ViewConditionModalProps) => {
  if (!isOpen || !condition) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{condition.id}</h2>
            <p className="text-sm text-slate-300 mt-1">{condition.desc}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                condition.status === 'cleared' ? 'bg-green-500/15 text-green-300' :
                condition.status === 'evidence_uploaded' ? 'bg-blue-500/15 text-blue-300' :
                condition.status === 'rejected' ? 'bg-red-500/15 text-red-300' :
                'bg-amber-500/15 text-amber-300'
              }`}>
                {condition.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Matter</label>
              <p className="text-slate-100 font-mono">{condition.matter}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Assigned To</label>
              <p className="text-slate-100">{condition.owner}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Due Date</label>
              <p className="text-slate-100">{condition.due}</p>
            </div>
          </div>

          {/* Evidence Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Evidence Documents</label>
            <div className="border border-white/10 rounded-lg p-4">
              {condition.status === 'evidence_uploaded' || condition.status === 'cleared' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <span className="text-sm text-slate-100">Finance_Approval_Letter.pdf</span>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <span className="text-sm text-slate-100">Loan_Contract_Signed.pdf</span>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No evidence uploaded yet</p>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Activity</label>
            <div className="border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-100">Condition cleared</p>
                  <p className="text-xs text-slate-300">Sarah Chen • 2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-100">Evidence uploaded</p>
                  <p className="text-xs text-slate-300">John Smith • 1 day ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-100">Condition created</p>
                  <p className="text-xs text-slate-300">System • 3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {condition.status !== 'cleared' && (
              <Button onClick={() => { toast.success('Condition cleared'); onClose(); }} className="flex-1">
                Mark as Cleared
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== CREATE PEXA WORKSPACE MODAL =====
interface CreatePEXAWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePEXAWorkspaceModal = ({ isOpen, onClose }: CreatePEXAWorkspaceModalProps) => {
  const [formData, setFormData] = useState({
    matter: '',
    jurisdiction: 'VIC',
    workspaceType: 'financial',
    settlementDate: '',
    settlementTime: '11:00'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workspaceId = `WS-${formData.jurisdiction}-2024-${Math.floor(Math.random() * 10000)}`;
    toast.success(`PEXA Workspace created: ${workspaceId}`);
    onClose();
    setFormData({
      matter: '',
      jurisdiction: 'VIC',
      workspaceType: 'financial',
      settlementDate: '',
      settlementTime: '11:00'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Create PEXA Workspace</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Matter *</label>
            <select
              required
              value={formData.matter}
              onChange={(e) => setFormData({ ...formData, matter: e.target.value })}
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select matter...</option>
              <option value="MAT-2024-1247">MAT-2024-1247 - 123 Collins St, Melbourne VIC</option>
              <option value="MAT-2024-1246">MAT-2024-1246 - 45 George St, Sydney NSW</option>
              <option value="MAT-2024-1245">MAT-2024-1245 - 78 Queen St, Brisbane QLD</option>
              <option value="MAT-2024-1244">MAT-2024-1244 - 12 King William Rd, Adelaide SA</option>
              <option value="MAT-2024-1243">MAT-2024-1243 - 156 St Georges Tce, Perth WA</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Jurisdiction *</label>
              <select
                required
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NSW">New South Wales</option>
                <option value="VIC">Victoria</option>
                <option value="QLD">Queensland</option>
                <option value="SA">South Australia</option>
                <option value="WA">Western Australia</option>
                <option value="ACT">Australian Capital Territory</option>
                <option value="TAS">Tasmania</option>
                <option value="NT">Northern Territory</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Workspace Type *</label>
              <select
                required
                value={formData.workspaceType}
                onChange={(e) => setFormData({ ...formData, workspaceType: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="financial">Financial Settlement</option>
                <option value="paper">Paper Settlement</option>
                <option value="lodgement">Lodgement Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Settlement Date *</label>
              <input
                type="date"
                required
                value={formData.settlementDate}
                onChange={(e) => setFormData({ ...formData, settlementDate: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Settlement Time *</label>
              <input
                type="time"
                required
                value={formData.settlementTime}
                onChange={(e) => setFormData({ ...formData, settlementTime: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300 font-medium mb-1">PEXA Integration</p>
            <p className="text-xs text-blue-300">
              This will create a new workspace in PEXA via API integration. All parties will be automatically invited based on matter participants.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Workspace
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===== ADD TASK MODAL =====
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    matter: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
    category: 'general'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Task created: ${formData.title}`);
    onClose();
    setFormData({
      title: '',
      matter: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      category: 'general'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Add Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Task Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Review and sign contract documents"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add task details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Matter *</label>
              <select
                required
                value={formData.matter}
                onChange={(e) => setFormData({ ...formData, matter: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select matter...</option>
                <option value="MAT-2024-1247">MAT-2024-1247 - 123 Collins St</option>
                <option value="MAT-2024-1246">MAT-2024-1246 - 45 George St</option>
                <option value="MAT-2024-1245">MAT-2024-1245 - 78 Queen St</option>
                <option value="MAT-2024-1244">MAT-2024-1244 - 12 King William Rd</option>
                <option value="MAT-2024-1243">MAT-2024-1243 - 156 St Georges Tce</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="document_review">Document Review</option>
                <option value="verification">Verification</option>
                <option value="signing">Signing</option>
                <option value="pexa">PEXA</option>
                <option value="settlement">Settlement</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Assigned To *</label>
              <select
                required
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select assignee...</option>
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="John Smith">John Smith</option>
                <option value="Lisa Wong">Lisa Wong</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Emma Davis">Emma Davis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Priority</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high', 'critical'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    formData.priority === priority
                      ? priority === 'critical'
                        ? 'border-red-500 bg-red-500/10 text-red-300'
                        : priority === 'high'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                        : priority === 'medium'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-gray-500 bg-white/5 text-slate-300'
                      : 'border-white/10 text-slate-300 hover:border-gray-400'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Task
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===== VIEW TASK MODAL =====
interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    title: string;
    matter: string;
    status: string;
    assignee: string;
    due: string;
  } | null;
}

export const ViewTaskModal = ({ isOpen, onClose, task }: ViewTaskModalProps) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{task.title}</h2>
            <p className="text-sm text-slate-300 mt-1">Matter: {task.matter}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Task Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                task.status === 'Complete' ? 'bg-green-500/15 text-green-300' :
                task.status === 'In Progress' ? 'bg-blue-500/15 text-blue-300' :
                task.status === 'Blocked' ? 'bg-red-500/15 text-red-300' :
                'bg-white/5 text-slate-300'
              }`}>
                {task.status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Assigned To</label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/15 rounded-full flex items-center justify-center text-sm font-semibold text-blue-300">
                  {task.assignee}
                </div>
                <span className="text-slate-100">{task.assignee === 'SC' ? 'Sarah Chen' : 'John Smith'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Due Date</label>
              <p className="text-slate-100">{task.due}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Priority</label>
              <span className="inline-block px-3 py-1 text-sm font-semibold rounded bg-amber-500/15 text-amber-300">
                Medium
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <p className="text-slate-100">Complete verification of identity documents for all borrowers and ensure compliance with AML/CTF requirements.</p>
          </div>

          {/* Checklist */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Checklist</label>
            <div className="border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-slate-100 line-through">Collect driver's license</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-slate-100 line-through">Verify address proof</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-slate-100">Complete AML check</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Activity</label>
            <div className="border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-100">Task updated to In Progress</p>
                  <p className="text-xs text-slate-300">Sarah Chen • 2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-100">Task created</p>
                  <p className="text-xs text-slate-300">System • 1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {task.status !== 'Complete' && (
              <Button onClick={() => { toast.success('Task marked as complete'); onClose(); }} className="flex-1">
                Mark Complete
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== VIEW PEXA WORKSPACE MODAL =====
interface ViewPEXAWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: {
    id: string;
    matter: string;
    property: string;
    status: string;
  } | null;
}

export const ViewPEXAWorkspaceModal = ({ isOpen, onClose, workspace }: ViewPEXAWorkspaceModalProps) => {
  if (!isOpen || !workspace) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-blue-300">{workspace.id}</h2>
            <p className="text-sm text-slate-300 mt-1">{workspace.property}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Workspace Details */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Matter</label>
              <p className="text-slate-100 font-mono">{workspace.matter}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                workspace.status === 'READY TO SETTLE' ? 'bg-green-500/15 text-green-300' :
                workspace.status === 'ACTIVE' ? 'bg-blue-500/15 text-blue-300' :
                'bg-amber-500/15 text-amber-300'
              }`}>
                {workspace.status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Last Sync</label>
              <p className="text-slate-100">15 min ago</p>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">PEXA Participants</label>
            <div className="border border-white/10 rounded-lg p-4 space-y-2">
              {[
                { name: 'Sarah Chen', role: 'Subscriber - Purchaser', status: 'Accepted' },
                { name: 'Michael Johnson', role: 'Subscriber - Vendor', status: 'Accepted' },
                { name: 'Commonwealth Bank', role: 'Financial Institution', status: 'Pending' }
              ].map((participant, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <div>
                    <p className="font-medium text-slate-100">{participant.name}</p>
                    <p className="text-xs text-slate-300">{participant.role}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    participant.status === 'Accepted' ? 'bg-green-500/15 text-green-300' : 'bg-amber-500/15 text-amber-300'
                  }`}>
                    {participant.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Data */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Financial Settlement Data</label>
            <div className="border border-white/10 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-300">Purchase Price</p>
                  <p className="text-lg font-bold text-slate-100">$1,250,000.00</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Deposit Paid</p>
                  <p className="text-lg font-bold text-green-300">$125,000.00</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Balance Due</p>
                  <p className="text-lg font-bold text-blue-300">$1,125,000.00</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Settlement Date</p>
                  <p className="text-lg font-bold text-slate-100">15 Mar 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => toast.success('Synced with PEXA')} className="flex-1">
              Sync Now
            </Button>
            <Button variant="outline" onClick={() => toast.info('Opening PEXA portal...')}>
              Open in PEXA
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};