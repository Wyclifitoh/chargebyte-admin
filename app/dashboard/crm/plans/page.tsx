'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';

const getCurrentWeekRange = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return { start, end };
};

const mockPlans = [
  {
    id: 'P001',
    member: 'John Kamau',
    startDate: '2024-02-26',
    endDate: '2024-03-01',
    goals: [
      { id: 1, text: 'Complete 50 activations', completed: false },
      { id: 2, text: 'Generate 10 new leads', completed: false },
      { id: 3, text: 'Close 2 location partnerships', completed: false },
      { id: 4, text: 'Conduct team training session', completed: false },
    ],
    notes: 'Focus on CBD and Westlands areas this week',
  },
  {
    id: 'P002',
    member: 'Mary Wanjiru',
    startDate: '2024-02-26',
    endDate: '2024-03-01',
    goals: [
      { id: 1, text: 'Meet with 5 potential sponsors', completed: true },
      { id: 2, text: 'Complete 30 activations', completed: false },
      { id: 3, text: 'Review team performance reports', completed: true },
      { id: 4, text: 'Update CRM data', completed: false },
    ],
    notes: 'Priority on sponsor relationships',
  },
];

const getWeekOptions = () => {
  const weeks = [];
  const today = new Date();

  for (let i = -2; i <= 4; i++) {
    const weekStart = startOfWeek(addDays(today, i * 7), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(addDays(today, i * 7), { weekStartsOn: 1 });
    weeks.push({
      label: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`,
      start: format(weekStart, 'yyyy-MM-dd'),
      end: format(weekEnd, 'yyyy-MM-dd'),
    });
  }

  return weeks;
};

export default function PlansPage() {
  const [plans, setPlans] = useState(mockPlans);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const weekOptions = getWeekOptions();
  const [selectedWeek, setSelectedWeek] = useState(weekOptions[2]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [newPlan, setNewPlan] = useState({
    goals: '',
    notes: '',
  });

  const handleAddPlan = () => {
    if (!startDate || !endDate || !newPlan.goals) {
      toast.error('Please select dates and add goals');
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
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      goals: goalsList,
      notes: newPlan.notes,
    };

    setPlans([plan, ...plans]);
    setNewPlan({ goals: '', notes: '' });
    setStartDate(undefined);
    setEndDate(undefined);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Weekly Plan</DialogTitle>
              <DialogDescription>
                Set your goals and select the date range for your plan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Quick Select Week</Label>
                <Select
                  value={`${selectedWeek.start}_${selectedWeek.end}`}
                  onValueChange={(value) => {
                    const week = weekOptions.find(w => `${w.start}_${w.end}` === value);
                    if (week) {
                      setSelectedWeek(week);
                      setStartDate(new Date(week.start));
                      setEndDate(new Date(week.end));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a week" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekOptions.map((week, index) => (
                      <SelectItem key={index} value={`${week.start}_${week.end}`}>
                        {week.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => startDate ? date < startDate : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Goals * (one per line)</Label>
                <Textarea
                  value={newPlan.goals}
                  onChange={(e) => setNewPlan({ ...newPlan, goals: e.target.value })}
                  placeholder="Enter your goals, one per line..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Notes</Label>
                <Textarea
                  value={newPlan.notes}
                  onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                  placeholder="Additional notes or context for this plan..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button onClick={handleAddPlan} className="w-full h-11">
                <Plus className="h-4 w-4 mr-2" />
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
                      <CardTitle className="text-xl">
                        {format(new Date(plan.startDate), 'MMM d')} - {format(new Date(plan.endDate), 'MMM d, yyyy')}
                      </CardTitle>
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
