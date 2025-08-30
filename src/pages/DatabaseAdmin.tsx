import { useState } from "react";
import { useRole } from "../hooks/useRole";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Database, 
  Trash2, 
  Download, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { seedDatabase, clearSeededData } from "../lib/seedDatabase";

export default function DatabaseAdmin() {
  const { role } = useRole();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [lastActionTime, setLastActionTime] = useState<Date | null>(null);

  const handleSeedDatabase = async () => {
    if (!confirm('This will populate the database with test data. Continue?')) {
      return;
    }

    setIsSeeding(true);
    setLastAction(null);
    
    try {
      await seedDatabase();
      setLastAction('Database seeded successfully!');
      setLastActionTime(new Date());
    } catch (error) {
      setLastAction(`Seeding failed: ${error}`);
      setLastActionTime(new Date());
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('⚠️ WARNING: This will DELETE ALL seeded data! This action cannot be undone. Are you sure?')) {
      return;
    }

    if (!confirm('Are you absolutely certain? This will remove all test data from the database.')) {
      return;
    }

    setIsClearing(true);
    setLastAction(null);
    
    try {
      await clearSeededData();
      setLastAction('Database cleared successfully!');
      setLastActionTime(new Date());
    } catch (error) {
      setLastAction(`Clearing failed: ${error}`);
      setLastActionTime(new Date());
    } finally {
      setIsClearing(false);
    }
  };

  if (role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
          <p className="text-red-700">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Database Administration</h1>
          <p className="text-gray-600 mt-2">
            Manage database seeding and test data
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seed Database */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Upload className="w-5 h-5" />
              Seed Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Populate the database with realistic test data including users, courses, assignments, and submissions.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">What will be created:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 9 users (1 admin, 3 teachers, 5 students)</li>
                <li>• 3 courses (Internal Medicine, Surgery, Pediatrics)</li>
                <li>• 8 assignments across different types</li>
                <li>• 11 course enrollments</li>
                <li>• 4 class sessions</li>
                <li>• 3 announcements</li>
                <li>• 4 sample submissions with grades</li>
              </ul>
            </div>

            <Button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Seed Database
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Clear Database */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Trash2 className="w-5 h-5" />
              Clear Test Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Warning</span>
              </div>
              <p className="text-sm text-red-700">
                This action will permanently delete all seeded test data from the database. 
                This cannot be undone and will affect all collections.
              </p>
            </div>

            <Button
              onClick={handleClearDatabase}
              disabled={isClearing}
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Clearing Database...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Test Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      {lastAction && (
        <Card className={`border-2 ${
          lastAction.includes('successfully') 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {lastAction.includes('successfully') ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${
                  lastAction.includes('successfully') ? 'text-green-800' : 'text-red-800'
                }`}>
                  {lastAction}
                </p>
                {lastActionTime && (
                  <p className="text-sm text-gray-600">
                    {lastActionTime.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">1. Seed the Database</h4>
            <p className="text-gray-600">
              Click "Seed Database" to populate your database with realistic test data. 
              This will create users, courses, assignments, and submissions that you can use to test all portal features.
            </p>
            
            <h4 className="font-medium text-gray-800">2. Test the Portal</h4>
            <p className="text-gray-600">
              Once seeded, you can log in with any of the created test accounts:
            </p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Admin:</p>
                  <p>admin@jfk.edu</p>
                </div>
                <div>
                  <p className="font-medium">Teacher:</p>
                  <p>mchen@jfk.edu</p>
                </div>
                <div>
                  <p className="font-medium">Student:</p>
                  <p>athompson@jfk.edu</p>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-800">3. Clear When Done</h4>
            <p className="text-gray-600">
              Use "Clear Test Data" to remove all seeded data when you're finished testing. 
              This ensures your database is clean for production use.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
