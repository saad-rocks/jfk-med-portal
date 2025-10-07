import React, { memo, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";
import type { Course, Enrollment } from "../../types";

interface CourseOverviewProps {
  courses: Array<Course & { id: string }>;
  enrollments: Array<Enrollment & { id: string }>;
  courseEnrollments: { [courseId: string]: number };
  coursesLoading: boolean;
  role: string;
  onNavigateToCourse: (courseId: string) => void;
}

export const CourseOverview = memo(({
  courses,
  enrollments,
  courseEnrollments,
  coursesLoading,
  role,
  onNavigateToCourse
}: CourseOverviewProps) => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  if (coursesLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const myCourses = useMemo(() => {
    return role === 'student'
      ? courses.filter(course =>
          enrollments.some(enrollment => enrollment.courseId === course.id)
        )
      : courses;
  }, [role, courses, enrollments]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {role === 'student' ? 'My Courses' : 'Course Overview'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {myCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {role === 'student' ? 'No courses enrolled yet' : 'No courses available'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myCourses.slice(0, 3).map((course) => {
              const enrollmentCount = courseEnrollments[course.id] || 0;

              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{course.title}</h3>
                        <Badge variant="secondary">{course.code}</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {enrollmentCount} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.semester}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <Button
                      onClick={() => onNavigateToCourse(course.id)}
                      className="w-full justify-center text-sm md:w-auto"
                      size="sm"
                    >
                      View Course
                    </Button>
                  </div>
                </div>
              );
            })}

            {myCourses.length > 3 && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  View All Courses ({myCourses.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

CourseOverview.displayName = 'CourseOverview';
