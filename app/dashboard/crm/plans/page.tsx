'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar as CalendarIcon,
  Plus,
  Target,
  User,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockPlans = [
  {
    id: 'P001',
    member: 'John Kamau',
    week: 'Week 9, 2024',
    goals: [
      { id: 1, text: 'Complete 50 activations', completed: false },
      { id: 2, text: 'Generate 10 new leads', completed: false },
      { id: 3, text: 'Close 2 location partnerships', completed: false },
      { id: 4, text: 'Conduct team training session', completed: false },
    ],
    notes: 'Focus on CBD and Westlands areas this week',
    targetRevenue: 500000,
  },
  {
    id: 'P002',
    member: 'Mary Wanjiru',
    week: 'Week 9, 2024',
    goals: [
      { id: 1, text: 'Meet with 5 potential sponsors', completed: true },
      { id: 2, text: 'Complete 30 activations', completed: false },
      { id: 3, text: 'Review team performance reports', completed: true },
      { id: 4, text: 'Update CRM data', completed: false },
    ],
    notes: 'Priority on sponsor relationships',
    targetRevenue: 750000,
  },
];

export default function PlansPage() {
  const [plans, setPlans] = useState(mockPlans);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    week: '',
    goals: '',
    notes: '',
    targetRevenue: '',
  });

  const handleAddPlan = () => {
    if (!newPlan.week || !newPlan.goals) {
      toast.error('Please fill in week and goals');
      return;
    }

    const goalsList = newPlan.goals.split('\n').filter(g => g.trim()).map((goal, index) => ({
      id: index + 1,
      text: goal.trim(),
      completed: false,
    }));

    const plan = {
      id: `P${(plans.length + 1).toString().padStart(3, '0')}`,
      member: 'Current User',
      week: newPlan.week,
      goals: goalsList,
      notes: newPlan.notes,
      targetRevenue: parseInt(newPlan.targetRevenue) || 0,
    };

    setPlans([plan, ...plans]);
    setNewPlan({ week: '', goals: '', notes: '', targetRevenue: '' });
    setIsDialogOpen(false);
    toast.success('Weekly plan created successfully!');
  };

  const toggleGoal = (planId: string, goalId: number) => {
    setPlans(prev =>
      prev.map(plan =>
        plan.id === planId
          ? {
              ...plan,
              goals: plan.goals.map(goal =>
                goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
              ),
            }
          : plan
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Plans</h1>
          <p className="text-gray-600">Set goals and track weekly progress</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Weekly Plan</DialogTitle>
              <DialogDescription>
                Set your goals and targets for the week
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Week *</Label>
                <Input
                  value={newPlan.week}
                  onChange={(e) => setNewPlan({ ...newPlan, week: e.target.value })}
                  placeholder="e.g., Week 10, 2024"
                />
              </div>
              <div>
                <Label>Goals * (one per line)</Label>
                <Textarea
                  value={newPlan.goals}
                  onChange={(e) => setNewPlan({ ...newPlan, goals: e.target.value })}
                  placeholder="Enter your goals, one per line..."
                  rows={5}
                />
              </div>
              <div>
                <Label>Target Revenue (KES)</Label>
                <Input
                  type="number"
                  value={newPlan.targetRevenue}
                  onChange={(e) => setNewPlan({ ...newPlan, targetRevenue: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={newPlan.notes}
                  onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddPlan} className="w-full">
                Create Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans List */}
      <div className="space-y-6">
        {plans.map((plan) => {
          const completedGoals = plan.goals.filter(g => g.completed).length;
          const completionRate = Math.round((completedGoals / plan.goals.length) * 100);

          return (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                      <CalendarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plan.week}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <User className="h-4 w-4" />
                        <span>{plan.member}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
                      <span className="text-2xl font-bold text-emerald-600">{completionRate}%</span>
                      <span className="text-sm text-gray-600">Complete</span>
                    </div>
                    {plan.targetRevenue > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Target: KES {(plan.targetRevenue / 1000).toFixed(0)}K
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      Goals ({completedGoals}/{plan.goals.length} completed)
                    </h4>
                    <div className="space-y-2">
                      {plan.goals.map((goal) => (
                        <div
                          key={goal.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => toggleGoal(plan.id, goal.id)}
                        >
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              goal.completed
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {goal.completed && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span
                            className={`flex-1 ${
                              goal.completed
                                ? 'line-through text-gray-500'
                                : 'text-gray-900'
                            }`}
                          >
                            {goal.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {plan.notes && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{plan.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
