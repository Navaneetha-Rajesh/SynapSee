import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldAlert,
  Moon
} from 'lucide-react';

const isTimeToShowAlert = (scheduledTimeStr) => {
  if (!scheduledTimeStr) return false;
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let hours = 0;
    let minutes = 0;

    const timeClean = scheduledTimeStr.trim().toUpperCase();
    const isAmPm = timeClean.includes("AM") || timeClean.includes("PM");

    if (isAmPm) {
      const parts = timeClean.replace(/(AM|PM)/g, "").trim().split(":");
      hours = parseInt(parts[0], 10);
      minutes = parts[1] ? parseInt(parts[1], 10) : 0;
      if (timeClean.includes("PM") && hours < 12) hours += 12;
      if (timeClean.includes("AM") && hours === 12) hours = 0;
    } else {
      const parts = timeClean.split(":");
      hours = parseInt(parts[0], 10);
      minutes = parts[1] ? parseInt(parts[1], 10) : 0;
    }

    const scheduledMinutes = hours * 60 + minutes;
    return currentMinutes >= scheduledMinutes;
  } catch (e) {
    console.warn("Failed to parse scheduled time:", scheduledTimeStr, e);
    return false;
  }
};

export default function MedicationAlertModal({ medications = [], todayLogs = [], onMarkTaken }) {
  const [activeAlertMed, setActiveAlertMed] = useState(null);
  const [snoozedMeds, setSnoozedMeds] = useState({}); // { [medId]: snoozeUntilTime }

  // Monitor upcoming pending medications and pop up modal if active alert time or triggered
  useEffect(() => {
    const checkAlerts = () => {
      const nowTimestamp = Date.now();
      const alertMed = medications.find(m => {
        // Check if already taken today
        const alreadyTaken = todayLogs.some(log => log.medication_id === m.id && log.status === 'taken');
        if (alreadyTaken) return false;

        // Check if snoozed
        const isSnoozed = snoozedMeds[m.id] && nowTimestamp < snoozedMeds[m.id];
        if (isSnoozed) return false;

        // Check if past scheduled time
        return isTimeToShowAlert(m.scheduled_time);
      });

      if (alertMed) {
        setActiveAlertMed(alertMed);
      } else {
        setActiveAlertMed(null);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [medications, todayLogs, snoozedMeds]);

  // Prevent closing via ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeAlertMed) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [activeAlertMed]);

  const handleMarkTaken = async () => {
    if (!activeAlertMed) return;
    if (onMarkTaken) {
      await onMarkTaken(activeAlertMed.id);
    }
    setActiveAlertMed(null);
  };

  const handleSnooze = () => {
    if (!activeAlertMed) return;
    // Snooze for 15 minutes
    const snoozeUntil = Date.now() + 15 * 60 * 1000;
    setSnoozedMeds(prev => ({
      ...prev,
      [activeAlertMed.id]: snoozeUntil
    }));
    setActiveAlertMed(null);
  };

  // Find next upcoming pending medication
  const pendingMeds = medications.filter(m => !todayLogs.some(log => log.medication_id === m.id && log.status === 'taken'));

  return (
    <>
      {medications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-skyblue flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-4">
            <div className="bg-teal/10 p-3 rounded-2xl text-teal shrink-0">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <span className="text-teal font-extrabold text-xs uppercase tracking-wider block">Medication Schedule</span>
              <h3 className="text-xl font-black text-navy">
                {pendingMeds.length > 0
                  ? `Next Medication: ${pendingMeds[0]?.med_name} (${pendingMeds[0]?.scheduled_time})`
                  : "All medications taken for today! Great job!"
                }
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingMeds.length > 0 && (
              <button
                onClick={() => setActiveAlertMed(pendingMeds[0])}
                className="bg-alert hover:bg-alert/90 text-white font-extrabold py-3 px-6 rounded-2xl shadow-md transition flex items-center gap-2 text-md cursor-pointer animate-pulse min-h-[48px]"
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Simulate Medication Reminder Alert</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mandatory Non-Dismissible Alert Modal */}
      {activeAlertMed && (
        <div 
          className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => e.stopPropagation()} 
        >
          <div 
            className="bg-white text-navy rounded-3xl max-w-lg w-full shadow-2xl border-4 border-alert p-6 sm:p-8 space-y-6 relative text-center"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header Alert Badge */}
            <div className="mx-auto bg-alert/10 text-alert border border-alert/30 px-4 py-2 rounded-full w-fit flex items-center gap-2 animate-pulse">
              <ShieldAlert className="h-5 w-5" />
              <span className="font-black text-xs uppercase tracking-widest">Mandatory Medication Reminder</span>
            </div>

            {/* Image Thumbnail */}
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-4 border-teal shadow-xl bg-skysoft relative">
              <img 
                src={activeAlertMed.image_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"} 
                alt={activeAlertMed.med_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Medicine Info */}
            <div className="space-y-2">
              <span className="text-teal font-extrabold text-xs uppercase tracking-wider block">Scheduled Dosage ({activeAlertMed.scheduled_time})</span>
              <h2 className="text-3xl font-black text-navy leading-tight">{activeAlertMed.med_name}</h2>
              <div className="bg-skysoft p-3 rounded-xl border border-skyblue w-fit mx-auto font-black text-teal text-md">
                Dosage: {activeAlertMed.dosage}
              </div>
            </div>

            {/* Special Instructions & Remarks */}
            {activeAlertMed.remarks && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-left">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-amber-800 font-extrabold text-xs uppercase block">Special Remarks</span>
                  <p className="text-amber-900 font-bold text-sm leading-snug">{activeAlertMed.remarks}</p>
                </div>
              </div>
            )}

            {/* Mandatory Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleMarkTaken}
                className="w-full bg-teal hover:bg-navy text-white font-black py-5 px-8 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] text-xl flex items-center justify-center gap-3 cursor-pointer border-2 border-teal"
              >
                <CheckCircle2 className="h-7 w-7 text-skyblue" />
                <span>Mark Medicine Taken</span>
              </button>

              <button
                onClick={handleSnooze}
                className="w-full bg-white hover:bg-skysoft text-navy border-2 border-skyblue font-black py-3 px-6 rounded-2xl shadow-sm transition text-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Moon className="h-5 w-5 text-teal" />
                <span>Snooze / Remind Later (15 min)</span>
              </button>
              
              <p className="text-navy/50 text-[11px] font-bold uppercase tracking-wider">
                This prompt will remain active until completed or snoozed.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
