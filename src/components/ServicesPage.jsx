import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const visaOptions = [
  {
    type: "Albania Tourist Visa",
    fee: "5000 PKR",
    time: "7-10 days",
    requiredDocs: ["Passport", "Photograph", "Bank Statement"],
  },
  {
    type: "Moldova Business Visa",
    fee: "8000 PKR",
    time: "5-7 days",
    requiredDocs: ["Passport", "Invitation Letter", "CNIC"],
  },
];

const ServicesPage = () => {
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [uploads, setUploads] = useState({});
  const [viewDoc, setViewDoc] = useState(null);

  const handleVisaSelect = (e) => {
    const visa = visaOptions.find(v => v.type === e.target.value);
    setSelectedVisa(visa);
    setUploads({});
  };

  const handleFileChange = (docType, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploads(prev => ({
        ...prev,
        [docType]: {
          file,
          preview: reader.result
        }
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleView = (doc) => {
    if (doc.file.type === 'application/pdf') {
      window.open(doc.preview, '_blank');
    } else {
      setViewDoc(doc.preview);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="visa-card">
        <CardHeader>
          <CardTitle className="text-white">Visa Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-purple-400">Select Visa Type</Label>
            <select
              onChange={handleVisaSelect}
              className="w-full mt-1 bg-purple-900/40 text-white border border-purple-500 p-2 rounded"
            >
              <option value="">-- Select --</option>
              {visaOptions.map((v, idx) => (
                <option key={idx} value={v.type}>{v.type}</option>
              ))}
            </select>
          </div>

          {selectedVisa && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-purple-300">
                <span>Fee: <strong className="text-white">{selectedVisa.fee}</strong></span>
                <span>Processing Time: <strong className="text-white">{selectedVisa.time}</strong></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedVisa.requiredDocs.map((doc, idx) => (
                  <div key={idx}>
                    <Label className="text-purple-300">{doc}</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => handleFileChange(doc, e.target.files[0])}
                      className="text-white"
                    />
                    {uploads[doc]?.preview && (
                      <div className="mt-2">
                        <Button
                          size="sm"
                          className="text-sm px-3 bg-purple-700 hover:bg-purple-600 text-white"
                          onClick={() => handleView(uploads[doc])}
                        >
                          View
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Preview */}
      <Dialog open={!!viewDoc} onOpenChange={() => setViewDoc(null)}>
        <DialogContent className="max-w-lg w-full bg-[#1a0033] border border-purple-600">
          <img src={viewDoc} alt="Uploaded Document" className="w-full h-auto rounded" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesPage;
