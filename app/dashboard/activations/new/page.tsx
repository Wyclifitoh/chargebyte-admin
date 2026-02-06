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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  MapPin,
  User,
  Calendar,
  Users,
  Camera,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Kisii",
  "Kakamega",
  "Bungoma",
  "Busia",
  "Siaya",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
];

const AGENTS = [
  "John Doe",
  "Jane Smith",
  "Robert Johnson",
  "Sarah Williams",
  "Michael Brown",
];

export default function AddActivationPage() {
  const [formData, setFormData] = useState({
    locationName: "",
    county: "",
    address: "",
    coordinates: "",
    agentName: "",
    activationDate: "",
    peopleReached: "",
    contactPerson: "",
    contactPhone: "",
    status: "scheduled",
    notes: "",
    photos: [] as string[],
    hasElectricity: false,
    hasSecurity: false,
    hasShed: false,
    chargerInstalled: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Form submitted:", formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/activations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Activation
            </h1>
            <p className="text-gray-600 mt-1">
              Submit new activation data or update existing records
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Location Details */}
          <div className="lg:col-span-2 space-y-6">
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
                    <Label htmlFor="locationName">Location Name *</Label>
                    <Input
                      id="locationName"
                      placeholder="e.g., Nakuru Main Market"
                      value={formData.locationName}
                      onChange={(e) =>
                        handleInputChange("locationName", e.target.value)
                      }
                      required
                    />
                  </div>

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

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address or landmark"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="coordinates">GPS Coordinates</Label>
                    <Input
                      id="coordinates"
                      placeholder="e.g., -1.2921, 36.8219"
                      value={formData.coordinates}
                      onChange={(e) =>
                        handleInputChange("coordinates", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Activation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agentName">Assigned Agent *</Label>
                    <Select
                      value={formData.agentName}
                      onValueChange={(value) =>
                        handleInputChange("agentName", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGENTS.map((agent) => (
                          <SelectItem key={agent} value={agent}>
                            {agent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activationDate">Activation Date *</Label>
                    <Input
                      id="activationDate"
                      type="date"
                      value={formData.activationDate}
                      onChange={(e) =>
                        handleInputChange("activationDate", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="peopleReached">People Reached *</Label>
                    <Input
                      id="peopleReached"
                      type="number"
                      placeholder="Estimated number"
                      value={formData.peopleReached}
                      onChange={(e) =>
                        handleInputChange("peopleReached", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="visited">Visited</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      placeholder="Name of contact person"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        handleInputChange("contactPerson", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      placeholder="Phone number"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        handleInputChange("contactPhone", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any additional notes or observations..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Site Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasElectricity" className="cursor-pointer">
                    Electricity Available
                  </Label>
                  <Switch
                    id="hasElectricity"
                    checked={formData.hasElectricity}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasElectricity", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasSecurity" className="cursor-pointer">
                    Security Present
                  </Label>
                  <Switch
                    id="hasSecurity"
                    checked={formData.hasSecurity}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasSecurity", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasShed" className="cursor-pointer">
                    Shelter/Shed Available
                  </Label>
                  <Switch
                    id="hasShed"
                    checked={formData.hasShed}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasShed", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="chargerInstalled" className="cursor-pointer">
                    Charger Installed
                  </Label>
                  <Switch
                    id="chargerInstalled"
                    checked={formData.chargerInstalled}
                    onCheckedChange={(checked) =>
                      handleInputChange("chargerInstalled", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photo Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Upload photos of the location
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Select Photos
                  </Button>
                </div>
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-md"></div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button type="submit" className="w-full" size="lg">
                    <Save className="mr-2 h-4 w-4" />
                    Save Activation
                  </Button>
                  <Button type="button" variant="outline" className="w-full">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
