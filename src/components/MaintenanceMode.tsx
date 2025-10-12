import { Construction, AlertTriangle, Clock, Mail } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface MaintenanceModeProps {
  message?: string;
}

export function MaintenanceMode({ message }: MaintenanceModeProps) {
  const defaultMessage = "System is currently under maintenance. Please check back later.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-orange-200">
        <CardContent className="p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Construction className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Under Maintenance
              </h1>
              <div className="flex items-center justify-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <p className="text-lg font-medium">
                  Temporarily Unavailable
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {message || defaultMessage}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Estimated Time</h3>
                    <p className="text-sm text-gray-600">We'll be back soon</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Need Help?</h3>
                    <p className="text-sm text-gray-600">Contact support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                We're performing scheduled maintenance to improve your experience.
                <br />
                Thank you for your patience!
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex justify-center gap-2 pt-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
