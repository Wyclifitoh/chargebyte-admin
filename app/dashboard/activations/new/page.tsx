// app/(dashboard)/activations/new/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  MapPin,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Wifi,
  Battery,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { createActivation } from "@/lib/api/activations";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const COUNTIES = [
  "Murang'a",
  "Kiambu",
  "Embu",
  "Machakos",
  "Nyeri",
  "Kericho",
  "Narok",
  "Meru",
  "Isiolo",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Kisii",
];

const LOCATION_TYPES = ["School", "Market", "Institution"] as const;
const INTERNET_METHODS = ["WiFi", "Powerbank", "Both"] as const;
const STATUS_OPTIONS = ["Scheduled", "Visited", "Cancelled"] as const;

export default function AddActivationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const [formData, setFormData] = useState({
    county: "",
    location_type: "Market" as "School" | "Market" | "Institution",
    location_name: "",
    status: "Visited" as "Scheduled" | "Visited" | "Cancelled",
    activity_awareness: 0,
    activity_training: 0,
    activity_demo: 0,
    giga_explained: 0,
    internet_method: "" as "WiFi" | "Powerbank" | "Both" | "",
    notes: "",
    visit_date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.county) {
      toast({
        title: "County Required",
        description: "Please select a county",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.location_name.trim()) {
      toast({
        title: "Location Name Required",
        description: "Please enter the location name",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.visit_date) {
      toast({
        title: "Visit Date Required",
        description: "Please select the visit date",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const submissionData = {
        ...formData,
        agent_id: 1, // Get from auth session
        people_reached: 0, // Will be updated later with contacts
        male_count: 0,
        female_count: 0,
        phone_contacts: 0,
        email_contacts: 0,
        activity_awareness: formData.activity_awareness,
        activity_training: formData.activity_training,
        activity_demo: formData.activity_demo,
        giga_explained: formData.giga_explained,
      };

      console.log("Submitting activation:", submissionData);

      const response = await createActivation(submissionData);

      if (response.success) {
        toast({
          title: "Success!",
          description: "Activation location saved. You can now add contacts.",
        });

        // Redirect to the activation list or show success with options
        setTimeout(() => {
          router.push("/dashboard/activations/list");
        }, 1500);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save activation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/activations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quick Activation Entry
            </h1>
            <p className="text-gray-600 mt-1">
              Add location details first, collect contacts later
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Location Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="county">County *</Label>
                  <Select
                    value={formData.county}
                    onValueChange={(value) =>
                      handleInputChange("county", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTIES.map((county) => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_type">Location Type *</Label>
                  <Select
                    value={formData.location_type}
                    onValueChange={(value: any) =>
                      handleInputChange("location_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="location_name">Location Name *</Label>
                  <Input
                    id="location_name"
                    placeholder="e.g., Murang'a Main Market, Kericho Primary School"
                    value={formData.location_name}
                    onChange={(e) =>
                      handleInputChange("location_name", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visit_date">Visit Date *</Label>
                  <Input
                    id="visit_date"
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) =>
                      handleInputChange("visit_date", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Activities & Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Activities & Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Activities Conducted</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activity_awareness"
                      checked={formData.activity_awareness === 1}
                      onCheckedChange={(checked) =>
                        handleInputChange("activity_awareness", checked ? 1 : 0)
                      }
                    />
                    <Label
                      htmlFor="activity_awareness"
                      className="cursor-pointer"
                    >
                      Awareness Session
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activity_training"
                      checked={formData.activity_training === 1}
                      onCheckedChange={(checked) =>
                        handleInputChange("activity_training", checked ? 1 : 0)
                      }
                    />
                    <Label
                      htmlFor="activity_training"
                      className="cursor-pointer"
                    >
                      Training
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activity_demo"
                      checked={formData.activity_demo === 1}
                      onCheckedChange={(checked) =>
                        handleInputChange("activity_demo", checked ? 1 : 0)
                      }
                    />
                    <Label htmlFor="activity_demo" className="cursor-pointer">
                      Demo Session
                    </Label>
                  </div>

                  <div className="hidden flex items-center space-x-2">
                    <Switch
                      id="giga_explained"
                      checked={formData.giga_explained === 1}
                      onCheckedChange={(checked) =>
                        handleInputChange("giga_explained", checked ? 1 : 0)
                      }
                    />
                    <Label htmlFor="giga_explained" className="cursor-pointer">
                      GIGA Explained
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="internet_method">Internet Method Used</Label>
                <Select
                  value={formData.internet_method}
                  onValueChange={(value: any) =>
                    handleInputChange("internet_method", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method used" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WiFi">
                      <div className="flex items-center">
                        <Wifi className="h-4 w-4 mr-2" />
                        WiFi Only
                      </div>
                    </SelectItem>
                    <SelectItem value="Powerbank">
                      <div className="flex items-center">
                        <Battery className="h-4 w-4 mr-2" />
                        Powerbank Only
                      </div>
                    </SelectItem>
                    <SelectItem value="Both">Both WiFi & Powerbank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes & Observations</Label>
                <Textarea
                  id="notes"
                  placeholder="Brief notes about the activation..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Tip:</span> Save location first,
              then add contacts from the activation list
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/activations/list">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Location
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Quick Stats Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {formData.county || "Not set"}
              </div>
              <div className="text-sm text-gray-500">County</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {formData.location_type}
              </div>
              <div className="text-sm text-gray-500">Type</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {formData.status}
              </div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {formData.visit_date}
              </div>
              <div className="text-sm text-gray-500">Visit Date</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
