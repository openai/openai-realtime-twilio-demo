// PhoneNumberChecklist.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, Eye, EyeOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PhoneNumberChecklistProps = {
  selectedPhoneNumber: string;
  allConfigsReady: boolean;
  setAllConfigsReady: (ready: boolean) => void;
};

const DEFAULT_TARGET_NUMBER = "555-555-5555";

const PhoneNumberChecklist: React.FC<PhoneNumberChecklistProps> = ({
  selectedPhoneNumber,
  allConfigsReady,
  setAllConfigsReady,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [targetNumber, setTargetNumber] = useState(DEFAULT_TARGET_NUMBER);

  const handleCall = async () => {
    if (!selectedPhoneNumber || !allConfigsReady || !targetNumber) return;

    try {
      setIsCallLoading(true);
      const response = await fetch("/api/twilio/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: targetNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to make call");
      }
    } catch (error: any) {
      console.error("Error making call:", error);
    } finally {
      setIsCallLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <span className="text-sm text-gray-500">Twilio Number</span>
            <div className="flex items-center">
              <span className="font-medium w-36">
                {isVisible ? selectedPhoneNumber || "None" : "••••••••••"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(!isVisible)}
                className="h-8 w-8"
              >
                {isVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {allConfigsReady ? (
              <CheckCircle className="text-green-500 w-4 h-4" />
            ) : (
              <Circle className="text-gray-400 w-4 h-4" />
            )}
            <span className="text-sm text-gray-700">
              {allConfigsReady ? "Setup Ready" : "Setup Not Ready"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAllConfigsReady(false)}
          >
            Checklist
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <Input
          value={targetNumber}
          onChange={(e) => setTargetNumber(e.target.value)}
          placeholder="Enter phone number to call"
          className="max-w-[300px]"
        />
        <Button
          variant="default"
          size="default"
          onClick={handleCall}
          disabled={!allConfigsReady || isCallLoading || !targetNumber}
          className="gap-2"
        >
          <Phone className="h-4 w-4" />
          {isCallLoading ? "Calling..." : "Call"}
        </Button>
      </div>
    </Card>
  );
};

export default PhoneNumberChecklist;
