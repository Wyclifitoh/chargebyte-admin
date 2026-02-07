// app/(dashboard)/activations/list/components/ViewContactsModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Phone,
  Mail,
  User,
  X,
  Download,
  Zap,
  Battery,
  BatteryWarning,
  CreditCard,
  Globe,
  School,
  BarChart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getActivationContacts } from "@/lib/api/activations";

interface ViewContactsModalProps {
  activation: any;
  open: boolean;
  onClose: () => void;
}

// Helper function to get rating display
const getRatingDisplay = (rating: number) => {
  if (!rating) return "-";
  return (
    <div className="flex items-center">
      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${(rating / 5) * 100}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium">{rating}/5</span>
    </div>
  );
};

// Labels for the survey questions
const surveyLabels = {
  electricity_access: {
    title: "Electricity Access",
    icon: Zap,
    labels: {
      1: "Never",
      2: "Rarely",
      3: "Sometimes",
      4: "Often",
      5: "Always",
    },
  },
  phone_power_outage: {
    title: "Phone Power Outage",
    icon: BatteryWarning,
    labels: {
      1: "Never",
      2: "Rarely",
      3: "Sometimes",
      4: "Often",
      5: "Very Often",
    },
  },
  charge_station_help: {
    title: "Charge Station Help",
    icon: Battery,
    labels: {
      1: "Not at all",
      2: "Slightly",
      3: "Moderately",
      4: "Quite a bit",
      5: "Very much",
    },
  },
  pay_for_charging: {
    title: "Pay for Charging",
    icon: CreditCard,
    labels: {
      1: "No",
      2: "Probably not",
      3: "Maybe",
      4: "Probably yes",
      5: "Yes",
    },
  },
  internet_access_frequency: {
    title: "Internet Access",
    icon: Globe,
    labels: {
      1: "Never",
      2: "Once a week",
      3: "A few times/week",
      4: "Daily",
      5: "Many times/day",
    },
  },
  school_connectivity_awareness: {
    title: "School Connectivity",
    icon: School,
    labels: {
      1: "Not aware",
      2: "Slightly",
      3: "Moderately",
      4: "Very aware",
      5: "Extremely aware",
    },
  },
};

export default function ViewContactsModal({
  activation,
  open,
  onClose,
}: ViewContactsModalProps) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSurveyStats, setShowSurveyStats] = useState(false);
  const [averages, setAverages] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open && activation) {
      fetchContacts();
    }
  }, [open, activation]);

  useEffect(() => {
    if (contacts.length > 0) {
      calculateAverages();
    }
  }, [contacts]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await getActivationContacts(activation.id);
      setContacts(response.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverages = () => {
    const surveyFields = [
      "electricity_access",
      "phone_power_outage",
      "charge_station_help",
      "pay_for_charging",
      "internet_access_frequency",
      "school_connectivity_awareness",
    ];

    const newAverages: Record<string, number> = {};

    surveyFields.forEach((field) => {
      const validRatings = contacts
        .map((c) => c[field])
        .filter((rating) => rating !== null && rating !== undefined);

      if (validRatings.length > 0) {
        const sum = validRatings.reduce((a, b) => a + b, 0);
        newAverages[field] = parseFloat((sum / validRatings.length).toFixed(1));
      } else {
        newAverages[field] = 0;
      }
    });

    setAverages(newAverages);
  };

  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case "Male":
        return <Badge className="bg-blue-100 text-blue-800">Male</Badge>;
      case "Female":
        return <Badge className="bg-pink-100 text-pink-800">Female</Badge>;
      default:
        return <Badge variant="outline">{gender}</Badge>;
    }
  };

  const getSurveyLabel = (field: string, value: number) => {
    if (!value) return "-";
    const labels = surveyLabels[field as keyof typeof surveyLabels]?.labels;
    return labels?.[value] || `${value}/5`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Contacts for {activation?.location_name}
            <Badge variant="outline" className="ml-2">
              {contacts.length} people
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {activation?.county} • {activation?.location_type}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toggle for Survey Stats */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {contacts.length} contacts collected
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSurveyStats(!showSurveyStats)}
            >
              <BarChart className="h-4 w-4 mr-2" />
              {showSurveyStats ? "Hide Survey Stats" : "Show Survey Stats"}
            </Button>
          </div>

          {/* Survey Statistics */}
          {showSurveyStats && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3 flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Survey Response Averages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(surveyLabels).map(([key, survey]) => {
                  const Icon = survey.icon;
                  const avg = averages[key] || 0;
                  const percentage = (avg / 5) * 100;
                  return (
                    <div
                      key={key}
                      className="text-center p-3 border rounded-lg bg-white"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Icon className="h-4 w-4 mr-2 text-gray-600" />
                        <div className="text-sm font-medium">
                          {survey.title}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {avg.toFixed(1)}/5
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {contacts.filter((c) => c[key]).length} responses
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 border rounded-lg bg-white">
              <div className="text-xl font-bold text-blue-600">
                {contacts.filter((c) => c.gender === "Male").length}
              </div>
              <div className="text-sm text-gray-500">Male</div>
            </div>
            <div className="text-center p-3 border rounded-lg bg-white">
              <div className="text-xl font-bold text-pink-600">
                {contacts.filter((c) => c.gender === "Female").length}
              </div>
              <div className="text-sm text-gray-500">Female</div>
            </div>
            <div className="text-center p-3 border rounded-lg bg-white">
              <div className="text-xl font-bold text-green-600">
                {contacts.filter((c) => c.phone).length}
              </div>
              <div className="text-sm text-gray-500">Phone Contacts</div>
            </div>
            <div className="text-center p-3 border rounded-lg bg-white">
              <div className="text-xl font-bold text-purple-600">
                {contacts.filter((c) => c.email).length}
              </div>
              <div className="text-sm text-gray-500">Email Contacts</div>
            </div>
          </div>

          {/* Contacts Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No contacts yet</h3>
              <p className="text-gray-500 mb-4">
                Start adding contacts for this activation
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Occupation</TableHead>
                    {showSurveyStats && (
                      <>
                        <TableHead>
                          <div className="flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            Electricity
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            <BatteryWarning className="h-3 w-3 mr-1" />
                            Phone Power
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            <Battery className="h-3 w-3 mr-1" />
                            Station Help
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            <CreditCard className="h-3 w-3 mr-1" />
                            Pay to Charge
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            Internet
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            <School className="h-3 w-3 mr-1" />
                            School Aware
                          </div>
                        </TableHead>
                      </>
                    )}
                    <TableHead className="max-w-xs">Interests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {contact.full_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {contact.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {contact.phone}
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {contact.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getGenderBadge(contact.gender)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {contact.age_range || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {contact.occupation ? (
                          <Badge variant="secondary" className="bg-blue-50">
                            {contact.occupation}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      {showSurveyStats && (
                        <>
                          <TableCell>
                            {getSurveyLabel(
                              "electricity_access",
                              contact.electricity_access,
                            )}
                          </TableCell>
                          <TableCell>
                            {getSurveyLabel(
                              "phone_power_outage",
                              contact.phone_power_outage,
                            )}
                          </TableCell>
                          <TableCell>
                            {getSurveyLabel(
                              "charge_station_help",
                              contact.charge_station_help,
                            )}
                          </TableCell>
                          <TableCell>
                            {getSurveyLabel(
                              "pay_for_charging",
                              contact.pay_for_charging,
                            )}
                          </TableCell>
                          <TableCell>
                            {getSurveyLabel(
                              "internet_access_frequency",
                              contact.internet_access_frequency,
                            )}
                          </TableCell>
                          <TableCell>
                            {getSurveyLabel(
                              "school_connectivity_awareness",
                              contact.school_connectivity_awareness,
                            )}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="max-w-xs text-sm">
                        {contact.interests ? (
                          <div className="truncate" title={contact.interests}>
                            {contact.interests}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                // Export functionality
                const dataStr = JSON.stringify(contacts, null, 2);
                const dataUri =
                  "data:application/json;charset=utf-8," +
                  encodeURIComponent(dataStr);
                const exportFileDefaultName = `contacts-${activation.location_name}-${new Date().toISOString().split("T")[0]}.json`;

                const linkElement = document.createElement("a");
                linkElement.setAttribute("href", dataUri);
                linkElement.setAttribute("download", exportFileDefaultName);
                linkElement.click();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Contacts
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
