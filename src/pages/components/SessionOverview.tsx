import React, { memo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar, Clock, MapPin, Users, ChevronDown, ChevronUp } from "lucide-react";
import type { Session } from "../../lib/sessions";

interface SessionOverviewProps {
  currentSession: Session | null;
  nextSession: Session | null;
  sessionsLoading: boolean;
}

export const SessionOverview = memo(({ currentSession, nextSession, sessionsLoading }: SessionOverviewProps) => {
  const [expandedSession, setExpandedSession] = useState<'current' | 'next' | null>(null);

  if (sessionsLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Session Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Session */}
          {currentSession && (
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">Current Session</h3>
                    <Badge className={currentSession.isCurrent ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {currentSession.isCurrent ? 'Current' : 'Active'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{currentSession.name} {currentSession.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(currentSession.startDate instanceof Date ? currentSession.startDate : currentSession.startDate.toDate())} - {formatDate(currentSession.endDate instanceof Date ? currentSession.endDate : currentSession.endDate.toDate())}</span>
                    </div>
                  </div>

                  <h4 className="font-medium mb-2">{currentSession.name} {currentSession.year} Academic Session</h4>
                  <p className="text-gray-700 text-sm mb-3">{currentSession.description || 'Academic session period'}</p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedSession(expandedSession === 'current' ? null : 'current')}
                >
                  {expandedSession === 'current' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              {expandedSession === 'current' && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(currentSession.startDate instanceof Date ? currentSession.startDate : currentSession.startDate.toDate())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {Math.round(((currentSession.endDate instanceof Date ? currentSession.endDate : currentSession.endDate.toDate()).getTime() - (currentSession.startDate instanceof Date ? currentSession.startDate : currentSession.startDate.toDate()).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Next Session */}
          {nextSession && (
            <div className="border rounded-lg p-4 bg-blue-50/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">Next Session</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      Upcoming
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{nextSession.name} {nextSession.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(nextSession.startDate instanceof Date ? nextSession.startDate : nextSession.startDate.toDate())} - {formatDate(nextSession.endDate instanceof Date ? nextSession.endDate : nextSession.endDate.toDate())}</span>
                    </div>
                  </div>

                  <h4 className="font-medium mb-2">{nextSession.name} {nextSession.year} Academic Session</h4>
                  <p className="text-gray-700 text-sm mb-3">{nextSession.description || 'Upcoming academic session period'}</p>

                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Calendar className="h-4 w-4" />
                    <span>Starts {formatDate(nextSession.startDate instanceof Date ? nextSession.startDate : nextSession.startDate.toDate())}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedSession(expandedSession === 'next' ? null : 'next')}
                >
                  {expandedSession === 'next' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              {expandedSession === 'next' && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(nextSession.startDate instanceof Date ? nextSession.startDate : nextSession.startDate.toDate())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {Math.round(((nextSession.endDate instanceof Date ? nextSession.endDate : nextSession.endDate.toDate()).getTime() - (nextSession.startDate instanceof Date ? nextSession.startDate : nextSession.startDate.toDate()).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Sessions */}
          {!currentSession && !nextSession && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming sessions scheduled</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

SessionOverview.displayName = 'SessionOverview';
