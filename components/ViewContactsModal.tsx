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
import { Users, Phone, Mail, User, X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { getActivationContacts } from "@/lib/api/activations";

interface ViewContactsModalProps {
  activation: any;
  open: boolean;
  onClose: () => void;
}

export default function ViewContactsModal({
  activation,
  open,
  onClose,
}: ViewContactsModalProps) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && activation) {
      fetchContacts();
    }
  }, [open, activation]);

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {contacts.filter((c) => c.gender === "Male").length}
              </div>
              <div className="text-sm text-gray-500">Male</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold text-pink-600">
                {contacts.filter((c) => c.gender === "Female").length}
              </div>
              <div className="text-sm text-gray-500">Female</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {contacts.filter((c) => c.phone).length}
              </div>
              <div className="text-sm text-gray-500">Phone Contacts</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
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
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No contacts yet</h3>
              <p className="text-gray-500 mb-4">
                Start adding contacts for this activation
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Interests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
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
                      <TableCell>{contact.age_range}</TableCell>
                      <TableCell>{contact.occupation || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {contact.interests || "-"}
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
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Contacts
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
