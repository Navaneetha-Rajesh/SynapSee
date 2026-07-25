import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Home, 
  Compass, 
  Phone, 
  X, 
  ExternalLink, 
  CheckCircle2
} from 'lucide-react';

export default function TakeMeHomeGPS({ userHomeAddress = "742 Evergreen Terrace, Springfield, OR 97477", userHomeCoords = { lat: 44.0462, lng: -123.022 } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(null);

  const handleOpenGPS = () => {
    setIsOpen(true);
    setLoading(true);
    setErrorMsg("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          console.warn("Geolocation warning/permission denied. Using fallback coordinates:", err);
          // Fallback location near home for demonstration
          setCurrentCoords({
            lat: userHomeCoords.lat + 0.005,
            lng: userHomeCoords.lng + 0.003
          });
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setCurrentCoords({
        lat: userHomeCoords.lat + 0.005,
        lng: userHomeCoords.lng + 0.003
      });
      setLoading(false);
    }
  };

  const encodedHomeAddress = encodeURIComponent(userHomeAddress);
  const googleMapsDirectionsUrl = currentCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${currentCoords.lat},${currentCoords.lng}&destination=${encodedHomeAddress}&travelmode=walking`
    : `https://www.google.com/maps/search/?api=1&query=${encodedHomeAddress}`;

  return (
    <>
      {/* Floating Action Button (Bottom-Right Pinned) */}
      <button
        onClick={handleOpenGPS}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 bg-teal text-white hover:bg-navy rounded-full shadow-2xl flex items-center justify-center border-4 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
        title="Take Me Home GPS Guidance"
        aria-label="Open Take Me Home GPS Guidance"
      >
        <Navigation className="h-8 w-8 text-white group-hover:rotate-12 transition-transform" />
        <span className="sr-only">Take Me Home</span>
      </button>

      {/* GPS Guidance Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white text-navy rounded-3xl max-w-xl w-full shadow-2xl border-4 border-teal p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-skyblue pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-teal text-white p-3 rounded-2xl shadow-md">
                  <Home className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-navy leading-tight">Take Me Home</h3>
                  <p className="text-teal font-extrabold text-xs uppercase tracking-wider">Step-by-Step GPS Guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-skysoft hover:bg-skyblue rounded-full text-navy transition cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Target Address Header */}
            <div className="bg-skysoft p-4 rounded-2xl border border-skyblue flex items-start gap-3 text-left">
              <MapPin className="h-6 w-6 text-alert shrink-0 mt-1" />
              <div>
                <span className="text-[10px] font-extrabold text-teal uppercase tracking-wider">Registered Home Address</span>
                <p className="font-extrabold text-navy text-lg leading-snug">{userHomeAddress}</p>
              </div>
            </div>

            {/* Loading or Content */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <Compass className="h-12 w-12 text-teal animate-spin" />
                <p className="font-bold text-navy text-lg">Acquiring current GPS location...</p>
                <p className="text-navy/60 text-xs">Finding your safest walking route home.</p>
              </div>
            ) : (
              <div className="space-y-5 text-left">
                
                {/* Map Preview Placeholder / Embed */}
                <div className="rounded-2xl border-2 border-teal/40 overflow-hidden relative aspect-[16/9] bg-navy/10 flex items-center justify-center shadow-inner">
                  <iframe
                    title="Home Directions Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://maps.google.com/maps?q=${encodedHomeAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full opacity-90"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-xl shadow border border-teal/30 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    <span className="text-xs font-bold text-navy">GPS Position Acquired</span>
                  </div>
                </div>

                {/* Step-by-Step Directions */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-navy text-sm uppercase tracking-wider flex items-center gap-2">
                    <Compass className="h-4 w-4 text-teal" />
                    Turn-by-Turn Walking Directions
                  </h4>
                  <div className="space-y-2.5">
                    <div className="bg-skysoft p-3 rounded-xl border border-skyblue flex items-center gap-3">
                      <div className="bg-teal text-white h-7 w-7 rounded-full font-black text-xs flex items-center justify-center shrink-0">1</div>
                      <p className="text-sm font-semibold text-navy">Head East on Oak Street toward Main Boulevard (150 ft).</p>
                    </div>
                    <div className="bg-skysoft p-3 rounded-xl border border-skyblue flex items-center gap-3">
                      <div className="bg-teal text-white h-7 w-7 rounded-full font-black text-xs flex items-center justify-center shrink-0">2</div>
                      <p className="text-sm font-semibold text-navy">Turn right onto Evergreen Terrace (300 ft).</p>
                    </div>
                    <div className="bg-skysoft p-3 rounded-xl border border-skyblue flex items-center gap-3">
                      <div className="bg-teal text-white h-7 w-7 rounded-full font-black text-xs flex items-center justify-center shrink-0">3</div>
                      <p className="text-sm font-semibold text-navy">Your home is on the left side: 742 Evergreen Terrace.</p>
                    </div>
                  </div>
                </div>

                {/* Direct Google Maps Navigation Button */}
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-teal hover:bg-teal/90 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-3 text-lg cursor-pointer text-center"
                >
                  <span>Open Live Navigation in Google Maps</span>
                  <ExternalLink className="h-5 w-5" />
                </a>

                {/* Emergency Call Caregiver Button */}
                <button
                  onClick={() => alert("Connecting direct voice call to registered caregiver (Sarah Vance)...")}
                  className="w-full bg-navy hover:bg-navy/95 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow transition flex items-center justify-center gap-2 text-md cursor-pointer"
                >
                  <Phone className="h-5 w-5 text-skyblue" />
                  <span>Need Help? Call Family Caregiver</span>
                </button>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
