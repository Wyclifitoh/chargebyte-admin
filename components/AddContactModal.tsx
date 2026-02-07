"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addContactToActivation } from "@/lib/api/activations";

interface AddContactModalProps {
  activation: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddContactModal({
  activation,
  open,
  onClose,
  onSuccess,
}: AddContactModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    gender: "Male" as "Male" | "Female" | "Other",
    age_range: "18-25",
    occupation: "",
    interests: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter the person's name",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Call API to add contact
      const response = await addContactToActivation(activation.id, formData);

      if (response.success) {
        toast({
          title: "Success!",
          description: "Contact added successfully",
        });

        // Reset form
        setFormData({
          full_name: "",
          phone: "",
          email: "",
          gender: "Male",
          age_range: "18-25",
          occupation: "",
          interests: "",
        });

        // Notify parent
        onSuccess();

        // Keep modal open for next contact
        // onClose(); // Uncomment to close after each addition
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add contact",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Add Contact to {activation?.location_name}
          </DialogTitle>
          <DialogDescription>
            Add details for one person reached. Save and add another.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="07XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: any) => handleChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age_range">Age Range</Label>
                <Select
                  value={formData.age_range}
                  onValueChange={(value) => handleChange("age_range", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under 18">Under 18</SelectItem>
                    <SelectItem value="18-25">18-25</SelectItem>
                    <SelectItem value="26-35">26-35</SelectItem>
                    <SelectItem value="36-45">36-45</SelectItem>
                    <SelectItem value="46-55">46-55</SelectItem>
                    <SelectItem value="56+">56+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  placeholder="Student, Trader, Teacher..."
                  value={formData.occupation}
                  onChange={(e) => handleChange("occupation", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests / Notes</Label>
              <Textarea
                id="interests"
                placeholder="What are they interested in? Questions asked?"
                value={formData.interests}
                onChange={(e) => handleChange("interests", e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    full_name: "",
                    phone: "",
                    email: "",
                    gender: "Male",
                    age_range: "18-25",
                    occupation: "",
                    interests: "",
                  });
                }}
              >
                Clear Form
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Contact
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
