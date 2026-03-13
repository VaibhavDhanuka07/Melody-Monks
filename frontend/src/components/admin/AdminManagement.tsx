"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { apiBaseUrl } from "@/data/site";
import { blogCategories } from "@/data/blog";

type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  createdAt?: string;
};

type ReviewPayload = {
  id: string;
  studentName: string;
  photo?: string;
  rating: number;
  reviewText: string;
  videoUrl?: string;
};

type ToolPayload = {
  id: string;
  instrument: string;
  toolName: string;
  description: string;
  toolType: string;
};

type CoursePayload = {
  id: string;
  title: string;
  instrument?: string;
  level?: string;
};

type ModulePayload = {
  id: string;
  courseId?: string;
  title: string;
  description?: string;
  order: number;
  lessonCount?: number;
  duration?: string;
};

type LessonPayload = {
  id: string;
  moduleId?: string;
  title: string;
  videoUrl?: string;
  notes?: string;
  duration?: string;
  theory?: string;
};

type AssignmentPayload = {
  id: string;
  lessonId?: string;
  title: string;
  instructions: string;
  dueDays?: number;
};

type PracticeExercisePayload = {
  id: string;
  lessonId?: string;
  title: string;
  description: string;
  duration?: string;
};

type BlogFormState = {
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  category: string;
};

const defaultBlogForm: BlogFormState = {
  title: "",
  slug: "",
  content: "",
  image: "",
  author: "Debojeet Lahiri",
  category: blogCategories[0],
};

const defaultReviewForm = {
  studentName: "",
  photo: "",
  rating: 5,
  reviewText: "",
  videoUrl: "",
};

const defaultToolForm = {
  instrument: "General",
  toolName: "",
  description: "",
  toolType: "Practice",
};

const defaultModuleForm = {
  courseId: "",
  title: "",
  description: "",
  order: 1,
  lessonCount: 4,
  duration: "45 min",
};

const defaultLessonForm = {
  moduleId: "",
  title: "",
  videoUrl: "",
  notes: "",
  duration: "45 min",
  theory: "",
};

const defaultAssignmentForm = {
  lessonId: "",
  title: "",
  instructions: "",
  dueDays: 7,
};

const defaultExerciseForm = {
  lessonId: "",
  title: "",
  description: "",
  duration: "10 min",
};

export default function AdminManagement() {
  const [blogPosts, setBlogPosts] = useState<AdminBlog[]>([]);
  const [reviews, setReviews] = useState<ReviewPayload[]>([]);
  const [tools, setTools] = useState<ToolPayload[]>([]);
  const [courses, setCourses] = useState<CoursePayload[]>([]);
  const [modules, setModules] = useState<ModulePayload[]>([]);
  const [lessons, setLessons] = useState<LessonPayload[]>([]);
  const [assignments, setAssignments] = useState<AssignmentPayload[]>([]);
  const [practiceExercises, setPracticeExercises] = useState<PracticeExercisePayload[]>([]);

  const [blogForm, setBlogForm] = useState<BlogFormState>(defaultBlogForm);
  const [reviewForm, setReviewForm] = useState(defaultReviewForm);
  const [toolForm, setToolForm] = useState(defaultToolForm);
  const [moduleForm, setModuleForm] = useState(defaultModuleForm);
  const [lessonForm, setLessonForm] = useState(defaultLessonForm);
  const [assignmentForm, setAssignmentForm] = useState(defaultAssignmentForm);
  const [exerciseForm, setExerciseForm] = useState(defaultExerciseForm);

  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  const [status, setStatus] = useState<string | null>(null);
  const [courseFilterId, setCourseFilterId] = useState<string>("");
  const [moduleFilterId, setModuleFilterId] = useState<string>("");
  const [lessonFilterId, setLessonFilterId] = useState<string>("");
  const [lessonCourseFilterId, setLessonCourseFilterId] = useState<string>("");

  const courseMap = useMemo(() => {
    const map = new Map<string, CoursePayload>();
    courses.forEach((course) => map.set(course.id, course));
    return map;
  }, [courses]);

  const moduleMap = useMemo(() => {
    const map = new Map<string, ModulePayload>();
    modules.forEach((module) => map.set(module.id, module));
    return map;
  }, [modules]);

  const lessonMap = useMemo(() => {
    const map = new Map<string, LessonPayload>();
    lessons.forEach((lesson) => map.set(lesson.id, lesson));
    return map;
  }, [lessons]);

  useEffect(() => {
    setLessonCourseFilterId(courseFilterId);
  }, [courseFilterId]);

  useEffect(() => {
    if (!moduleFilterId) return;
    const moduleInfo = moduleMap.get(moduleFilterId);
    if (moduleInfo?.courseId && moduleInfo.courseId !== courseFilterId) {
      setCourseFilterId(moduleInfo.courseId);
    }
  }, [courseFilterId, moduleFilterId, moduleMap]);

  useEffect(() => {
    if (!lessonFilterId) return;
    const lesson = lessonMap.get(lessonFilterId);
    const resolvedModuleId = lesson?.moduleId ?? "";
    if (resolvedModuleId && resolvedModuleId !== moduleFilterId) {
      setModuleFilterId(resolvedModuleId);
    }
    if (resolvedModuleId) {
      const moduleInfo = moduleMap.get(resolvedModuleId);
      if (moduleInfo?.courseId && moduleInfo.courseId !== courseFilterId) {
        setCourseFilterId(moduleInfo.courseId);
      }
    }
  }, [courseFilterId, lessonFilterId, lessonMap, moduleFilterId, moduleMap]);

  const filteredModules = useMemo(() => {
    if (!courseFilterId) return modules;
    return modules.filter((module) => module.courseId === courseFilterId);
  }, [courseFilterId, modules]);

  const lessonFormModules = useMemo(() => {
    if (!lessonCourseFilterId) return modules;
    return modules.filter((module) => module.courseId === lessonCourseFilterId);
  }, [lessonCourseFilterId, modules]);

  const filteredLessons = useMemo(() => {
    if (moduleFilterId) {
      return lessons.filter((lesson) => lesson.moduleId === moduleFilterId);
    }
    if (courseFilterId) {
      const moduleIds = new Set(
        modules.filter((module) => module.courseId === courseFilterId).map((module) => module.id)
      );
      return lessons.filter((lesson) => lesson.moduleId && moduleIds.has(lesson.moduleId));
    }
    return lessons;
  }, [courseFilterId, lessons, moduleFilterId, modules]);

  const filteredAssignments = useMemo(() => {
    if (lessonFilterId) {
      return assignments.filter((assignment) => assignment.lessonId === lessonFilterId);
    }
    if (moduleFilterId || courseFilterId) {
      const lessonIds = new Set(filteredLessons.map((lesson) => lesson.id));
      return assignments.filter(
        (assignment) => assignment.lessonId && lessonIds.has(assignment.lessonId)
      );
    }
    return assignments;
  }, [assignments, courseFilterId, filteredLessons, lessonFilterId, moduleFilterId]);

  const filteredExercises = useMemo(() => {
    if (lessonFilterId) {
      return practiceExercises.filter((exercise) => exercise.lessonId === lessonFilterId);
    }
    if (moduleFilterId || courseFilterId) {
      const lessonIds = new Set(filteredLessons.map((lesson) => lesson.id));
      return practiceExercises.filter(
        (exercise) => exercise.lessonId && lessonIds.has(exercise.lessonId)
      );
    }
    return practiceExercises;
  }, [courseFilterId, filteredLessons, lessonFilterId, moduleFilterId, practiceExercises]);

  const request = useCallback(
    (pathOrUrl: string, init?: RequestInit & { query?: Record<string, string | number> }) =>
      apiFetch(
        pathOrUrl.startsWith(apiBaseUrl)
          ? pathOrUrl.slice(apiBaseUrl.length)
          : pathOrUrl,
        {
          auth: true,
          ...init,
        }
      ),
    []
  );

  const fetchData = useCallback(async () => {
    try {
      const response = await request("/api/admin/bootstrap", {
        query: { limit: 100 },
      });
      if (!response.ok) {
        throw new Error("Unable to load admin content");
      }
      const data = (await response.json()) as {
        blog?: { posts?: AdminBlog[] };
        reviews?: { reviews?: ReviewPayload[] };
        tools?: { tools?: ToolPayload[] };
        courses?: { courses?: CoursePayload[] };
        modules?: { modules?: ModulePayload[] };
        lessons?: { lessons?: LessonPayload[] };
        assignments?: { assignments?: AssignmentPayload[] };
        exercises?: { exercises?: PracticeExercisePayload[] };
      };

      setBlogPosts(data.blog?.posts || []);
      setReviews(data.reviews?.reviews || []);
      setTools(data.tools?.tools || []);
      setCourses(data.courses?.courses || []);
      setModules(data.modules?.modules || []);
      setLessons(data.lessons?.lessons || []);
      setAssignments(data.assignments?.assignments || []);
      setPracticeExercises(data.exercises?.exercises || []);
    } catch {
      setStatus("Backend not reachable. Start the backend to manage content.");
    }
  }, [request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBlogSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const method = editingBlogId ? "PUT" : "POST";
    const endpoint = editingBlogId
      ? `/api/blog/${editingBlogId}`
      : "/api/blog";

    const response = await request(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogForm),
    });

    if (response.ok) {
      setBlogForm(defaultBlogForm);
      setEditingBlogId(null);
      await fetchData();
      setStatus("Blog post saved.");
    } else {
      setStatus("Unable to save blog post.");
    }
  };

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const method = editingReviewId ? "PUT" : "POST";
    const endpoint = editingReviewId
      ? `/api/reviews/${editingReviewId}`
      : "/api/reviews";

    const payload = {
      ...reviewForm,
      rating: Number(reviewForm.rating),
    };

    const response = await request(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setReviewForm(defaultReviewForm);
      setEditingReviewId(null);
      await fetchData();
      setStatus("Review saved.");
    } else {
      setStatus("Unable to save review.");
    }
  };

  const handleToolSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const method = editingToolId ? "PUT" : "POST";
    const endpoint = editingToolId
      ? `/api/tools/${editingToolId}`
      : "/api/tools";

    const response = await request(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolForm),
    });

    if (response.ok) {
      setToolForm(defaultToolForm);
      setEditingToolId(null);
      await fetchData();
      setStatus("Tool saved.");
    } else {
      setStatus("Unable to save tool.");
    }
  };

  const handleModuleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const method = editingModuleId ? "PUT" : "POST";
    const endpoint = editingModuleId
      ? `/api/modules/${editingModuleId}`
      : "/api/modules";

    const modulePayload = {
      ...moduleForm,
      courseId: moduleForm.courseId || undefined,
    };

    const response = await request(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modulePayload),
    });

    if (response.ok) {
      setModuleForm(defaultModuleForm);
      setEditingModuleId(null);
      await fetchData();
      setStatus("Module saved.");
    } else {
      setStatus("Unable to save module.");
    }
  };

  const handleLessonSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const method = editingLessonId ? "PUT" : "POST";
    const endpoint = editingLessonId
      ? `/api/lessons/${editingLessonId}`
      : "/api/lessons";

    const lessonPayload = {
      ...lessonForm,
      moduleId: lessonForm.moduleId || undefined,
    };

    const response = await request(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonPayload),
    });

    if (response.ok) {
      setLessonForm(defaultLessonForm);
      setEditingLessonId(null);
      await fetchData();
      setStatus("Lesson saved.");
    } else {
      setStatus("Unable to save lesson.");
    }
  };

  const handleAssignmentSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setStatus(null);
    const method = editingAssignmentId ? "PUT" : "POST";
    const endpoint = editingAssignmentId
      ? `/api/assignments/${editingAssignmentId}`
      : "/api/assignments";

    const assignmentPayload = {
      ...assignmentForm,
      lessonId: assignmentForm.lessonId || undefined,
    };

    const response = await request(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignmentPayload),
    });

    if (response.ok) {
      setAssignmentForm(defaultAssignmentForm);
      setEditingAssignmentId(null);
      await fetchData();
      setStatus("Assignment saved.");
    } else {
      setStatus("Unable to save assignment.");
    }
  };

  const handleExerciseSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setStatus(null);
    const method = editingExerciseId ? "PUT" : "POST";
    const endpoint = editingExerciseId
      ? `/api/practice-exercises/${editingExerciseId}`
      : "/api/practice-exercises";

    const exercisePayload = {
      ...exerciseForm,
      lessonId: exerciseForm.lessonId || undefined,
    };

    const response = await request(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exercisePayload),
    });

    if (response.ok) {
      setExerciseForm(defaultExerciseForm);
      setEditingExerciseId(null);
      await fetchData();
      setStatus("Exercise saved.");
    } else {
      setStatus("Unable to save exercise.");
    }
  };

  const deleteItem = async (path: string) => {
    setStatus(null);
    const response = await request(path, { method: "DELETE" });
    if (response.ok) {
      await fetchData();
      setStatus("Item deleted.");
    } else {
      setStatus("Unable to delete item.");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Content Management</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">
          Blog, reviews, and tools
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Manage posts, student reviews, and practice tools. Start the backend
          to persist changes.
        </p>
        {status ? <p className="mt-2 text-xs text-ink-muted">{status}</p> : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleBlogSubmit} className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Blog Post</p>
          <label className="text-sm text-ink-muted">
            Title
            <input
              value={blogForm.title}
              onChange={(event) =>
                setBlogForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Slug
            <input
              value={blogForm.slug}
              onChange={(event) =>
                setBlogForm((prev) => ({ ...prev, slug: event.target.value }))
              }
              placeholder="use-dashes-for-slug"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Category
            <select
              value={blogForm.category}
              onChange={(event) =>
                setBlogForm((prev) => ({
                  ...prev,
                  category: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              {blogCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-ink-muted">
            Author
            <input
              value={blogForm.author}
              onChange={(event) =>
                setBlogForm((prev) => ({ ...prev, author: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Featured Image URL
            <input
              value={blogForm.image}
              onChange={(event) =>
                setBlogForm((prev) => ({ ...prev, image: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Content
            <textarea
              value={blogForm.content}
              onChange={(event) =>
                setBlogForm((prev) => ({ ...prev, content: event.target.value }))
              }
              rows={4}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <button type="submit" className="btn-primary">
            {editingBlogId ? "Update Post" : "Add Post"}
          </button>
        </form>

        <div className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Existing Blog Posts</p>
          <div className="space-y-3 text-sm text-ink-muted">
            {blogPosts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              blogPosts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{post.title}</p>
                  <p className="text-xs text-ink-muted">{post.category}</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBlogId(post.id);
                        setBlogForm({
                          title: post.title,
                          slug: post.slug,
                          content: post.content || "",
                          image: post.image || "",
                          author: post.author,
                          category: post.category,
                        });
                      }}
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(`${apiBaseUrl}/api/blog/${post.id}`)}
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleReviewSubmit} className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Student Review</p>
          <label className="text-sm text-ink-muted">
            Student name
            <input
              value={reviewForm.studentName}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  studentName: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Rating (1-5)
            <input
              type="number"
              min={1}
              max={5}
              step={0.1}
              value={reviewForm.rating}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  rating: Number(event.target.value),
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Photo URL
            <input
              value={reviewForm.photo}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  photo: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Video URL (optional)
            <input
              value={reviewForm.videoUrl}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  videoUrl: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Review text
            <textarea
              value={reviewForm.reviewText}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  reviewText: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <button type="submit" className="btn-primary">
            {editingReviewId ? "Update Review" : "Add Review"}
          </button>
        </form>

        <div className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Existing Reviews</p>
          <div className="space-y-3 text-sm text-ink-muted">
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">
                    {review.studentName}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Rating: {review.rating}
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setReviewForm({
                          studentName: review.studentName,
                          photo: review.photo || "",
                          rating: review.rating,
                          reviewText: review.reviewText,
                          videoUrl: review.videoUrl || "",
                        });
                      }}
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteItem(`${apiBaseUrl}/api/reviews/${review.id}`)
                      }
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleToolSubmit} className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Tool</p>
          <label className="text-sm text-ink-muted">
            Instrument
            <input
              value={toolForm.instrument}
              onChange={(event) =>
                setToolForm((prev) => ({
                  ...prev,
                  instrument: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Tool name
            <input
              value={toolForm.toolName}
              onChange={(event) =>
                setToolForm((prev) => ({
                  ...prev,
                  toolName: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Tool type
            <input
              value={toolForm.toolType}
              onChange={(event) =>
                setToolForm((prev) => ({
                  ...prev,
                  toolType: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Description
            <textarea
              value={toolForm.description}
              onChange={(event) =>
                setToolForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <button type="submit" className="btn-primary">
            {editingToolId ? "Update Tool" : "Add Tool"}
          </button>
        </form>

        <div className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Existing Tools</p>
          <div className="space-y-3 text-sm text-ink-muted">
            {tools.length === 0 ? (
              <p>No tools yet.</p>
            ) : (
              tools.map((tool) => (
                <div key={tool.id} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">
                    {tool.toolName}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {tool.instrument} - {tool.toolType}
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingToolId(tool.id);
                        setToolForm({
                          instrument: tool.instrument || "General",
                          toolName: tool.toolName,
                          description: tool.description,
                          toolType: tool.toolType,
                        });
                      }}
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteItem(`${apiBaseUrl}/api/tools/${tool.id}`)
                      }
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card-strong p-6">
        <p className="text-sm font-semibold text-brand-gold">Curriculum Management</p>
        <h3 className="mt-2 text-2xl font-semibold text-ink">
          Modules, lessons, and assignments
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          Manage curriculum structure with modules, lessons, practice exercises,
          and assignments.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="text-xs text-ink-muted">
            Filter by course
            <select
              value={courseFilterId}
              onChange={(event) => {
                const value = event.target.value;
                setCourseFilterId(value);
                setModuleFilterId("");
                setLessonFilterId("");
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              <option value="">All courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} {course.instrument ? `(${course.instrument})` : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-ink-muted">
            Filter by module
            <select
              value={moduleFilterId}
              onChange={(event) => {
                const value = event.target.value;
                setModuleFilterId(value);
                setLessonFilterId("");
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              <option value="">All modules</option>
              {filteredModules.map((module) => (
                <option key={module.id} value={module.id}>
                  Week {module.order} - {module.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-ink-muted">
            Filter by lesson
            <select
              value={lessonFilterId}
              onChange={(event) => setLessonFilterId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              <option value="">All lessons</option>
              {filteredLessons.map((lesson) => {
                const moduleTitle = lesson.moduleId
                  ? moduleMap.get(lesson.moduleId)?.title
                  : null;
                return (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                  {moduleTitle ? ` (${moduleTitle})` : ""}
                </option>
              )})}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setCourseFilterId("");
              setModuleFilterId("");
              setLessonFilterId("");
              setLessonCourseFilterId("");
            }}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={() => {
              setCourseFilterId("");
              setModuleFilterId("");
              setLessonFilterId("");
              setLessonCourseFilterId("");
            }}
            className="btn-ghost px-4 py-2 text-xs"
          >
            Show All
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleModuleSubmit} className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Module</p>
          <label className="text-sm text-ink-muted">
            Course
            <select
              value={moduleForm.courseId}
              onChange={(event) =>
                setModuleForm((prev) => ({
                  ...prev,
                  courseId: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              <option value="">Unassigned</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} {course.instrument ? `(${course.instrument})` : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-ink-muted">
            Title
            <input
              value={moduleForm.title}
              onChange={(event) =>
                setModuleForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Description
            <textarea
              value={moduleForm.description}
              onChange={(event) =>
                setModuleForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-ink-muted">
              Order
              <input
                type="number"
                min={1}
                value={moduleForm.order}
                onChange={(event) =>
                  setModuleForm((prev) => ({
                    ...prev,
                    order: Number(event.target.value),
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Lesson Count
              <input
                type="number"
                min={1}
                value={moduleForm.lessonCount}
                onChange={(event) =>
                  setModuleForm((prev) => ({
                    ...prev,
                    lessonCount: Number(event.target.value),
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Duration
              <input
                value={moduleForm.duration}
                onChange={(event) =>
                  setModuleForm((prev) => ({
                    ...prev,
                    duration: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              />
            </label>
          </div>
          <button type="submit" className="btn-primary">
            {editingModuleId ? "Update Module" : "Add Module"}
          </button>
        </form>

        <div className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Existing Modules</p>
          <div className="space-y-3 text-sm text-ink-muted">
            {filteredModules.length === 0 ? (
              <p>No modules yet.</p>
            ) : (
              filteredModules.map((module) => (
                <div key={module.id} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">
                    {module.title}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Order {module.order} - {module.lessonCount ?? 0} lessons
                    {module.courseId && courseMap.get(module.courseId)
                      ? ` · ${courseMap.get(module.courseId)?.title}`
                      : ""}
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingModuleId(module.id);
                        setCourseFilterId(module.courseId ?? "");
                        setModuleForm({
                          courseId: module.courseId ?? "",
                          title: module.title,
                          description: module.description ?? "",
                          order: module.order,
                          lessonCount: module.lessonCount ?? 4,
                          duration: module.duration ?? "45 min",
                        });
                      }}
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteItem(`${apiBaseUrl}/api/modules/${module.id}`)
                      }
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleLessonSubmit} className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Lesson</p>
          <label className="text-sm text-ink-muted">
            Limit modules by course
            <select
              value={lessonCourseFilterId}
              onChange={(event) => setLessonCourseFilterId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              <option value="">All courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} {course.instrument ? `(${course.instrument})` : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-ink-muted">
            Module
            <select
              value={lessonForm.moduleId}
              onChange={(event) =>
                setLessonForm((prev) => ({
                  ...prev,
                  moduleId: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              <option value="">Unassigned</option>
              {lessonFormModules.map((module) => (
                <option key={module.id} value={module.id}>
                  Week {module.order} - {module.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-ink-muted">
            Title
            <input
              value={lessonForm.title}
              onChange={(event) =>
                setLessonForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Video URL
            <input
              value={lessonForm.videoUrl}
              onChange={(event) =>
                setLessonForm((prev) => ({
                  ...prev,
                  videoUrl: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Notes
            <textarea
              value={lessonForm.notes}
              onChange={(event) =>
                setLessonForm((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Theory
            <textarea
              value={lessonForm.theory}
              onChange={(event) =>
                setLessonForm((prev) => ({
                  ...prev,
                  theory: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Duration
            <input
              value={lessonForm.duration}
              onChange={(event) =>
                setLessonForm((prev) => ({
                  ...prev,
                  duration: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <button type="submit" className="btn-primary">
            {editingLessonId ? "Update Lesson" : "Add Lesson"}
          </button>
        </form>

        <div className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Existing Lessons</p>
          <div className="space-y-3 text-sm text-ink-muted">
            {filteredLessons.length === 0 ? (
              <p>No lessons yet.</p>
            ) : (
              filteredLessons.map((lesson) => (
                <div key={lesson.id} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">
                    {lesson.title}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {lesson.duration ?? "45 min"}
                    {lesson.moduleId && moduleMap.get(lesson.moduleId)
                      ? ` · ${moduleMap.get(lesson.moduleId)?.title}`
                      : ""}
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLessonId(lesson.id);
                        setModuleFilterId(lesson.moduleId ?? "");
                        setLessonForm({
                          moduleId: lesson.moduleId ?? "",
                          title: lesson.title,
                          videoUrl: lesson.videoUrl ?? "",
                          notes: lesson.notes ?? "",
                          duration: lesson.duration ?? "45 min",
                          theory: lesson.theory ?? "",
                        });
                      }}
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteItem(`${apiBaseUrl}/api/lessons/${lesson.id}`)
                      }
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleAssignmentSubmit} className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Assignment</p>
          <label className="text-sm text-ink-muted">
            Lesson
            <select
              value={assignmentForm.lessonId}
              onChange={(event) =>
                setAssignmentForm((prev) => ({
                  ...prev,
                  lessonId: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              <option value="">Unassigned</option>
              {filteredLessons.map((lesson) => {
                const moduleTitle = lesson.moduleId
                  ? moduleMap.get(lesson.moduleId)?.title
                  : null;
                return (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                    {moduleTitle ? ` (${moduleTitle})` : ""}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="text-sm text-ink-muted">
            Title
            <input
              value={assignmentForm.title}
              onChange={(event) =>
                setAssignmentForm((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Instructions
            <textarea
              value={assignmentForm.instructions}
              onChange={(event) =>
                setAssignmentForm((prev) => ({
                  ...prev,
                  instructions: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Due Days
            <input
              type="number"
              min={1}
              value={assignmentForm.dueDays}
              onChange={(event) =>
                setAssignmentForm((prev) => ({
                  ...prev,
                  dueDays: Number(event.target.value),
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <button type="submit" className="btn-primary">
            {editingAssignmentId ? "Update Assignment" : "Add Assignment"}
          </button>
        </form>

        <div className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Existing Assignments</p>
          <div className="space-y-3 text-sm text-ink-muted">
            {filteredAssignments.length === 0 ? (
              <p>No assignments yet.</p>
            ) : (
              filteredAssignments.map((assignment) => (
                <div key={assignment.id} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Due in {assignment.dueDays ?? 7} days
                    {assignment.lessonId && lessonMap.get(assignment.lessonId)
                      ? ` · ${lessonMap.get(assignment.lessonId)?.title}`
                      : ""}
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAssignmentId(assignment.id);
                        setLessonFilterId(assignment.lessonId ?? "");
                        setAssignmentForm({
                          lessonId: assignment.lessonId ?? "",
                          title: assignment.title,
                          instructions: assignment.instructions,
                          dueDays: assignment.dueDays ?? 7,
                        });
                      }}
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteItem(`${apiBaseUrl}/api/assignments/${assignment.id}`)
                      }
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleExerciseSubmit} className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Practice Exercise</p>
          <label className="text-sm text-ink-muted">
            Lesson
            <select
              value={exerciseForm.lessonId}
              onChange={(event) =>
                setExerciseForm((prev) => ({
                  ...prev,
                  lessonId: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            >
              <option value="">Unassigned</option>
              {filteredLessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-ink-muted">
            Title
            <input
              value={exerciseForm.title}
              onChange={(event) =>
                setExerciseForm((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              required
            />
          </label>
          <label className="text-sm text-ink-muted">
            Description
            <textarea
              value={exerciseForm.description}
              onChange={(event) =>
                setExerciseForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Duration
            <input
              value={exerciseForm.duration}
              onChange={(event) =>
                setExerciseForm((prev) => ({
                  ...prev,
                  duration: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
            />
          </label>
          <button type="submit" className="btn-primary">
            {editingExerciseId ? "Update Exercise" : "Add Exercise"}
          </button>
        </form>

        <div className="card p-6 space-y-4">
          <p className="text-sm font-semibold text-ink">Existing Exercises</p>
          <div className="space-y-3 text-sm text-ink-muted">
            {filteredExercises.length === 0 ? (
              <p>No exercises yet.</p>
            ) : (
              filteredExercises.map((exercise) => (
                <div key={exercise.id} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">
                    {exercise.title}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {exercise.duration ?? "10 min"}
                    {exercise.lessonId && lessonMap.get(exercise.lessonId)
                      ? ` · ${lessonMap.get(exercise.lessonId)?.title}`
                      : ""}
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExerciseId(exercise.id);
                        setLessonFilterId(exercise.lessonId ?? "");
                        setExerciseForm({
                          lessonId: exercise.lessonId ?? "",
                          title: exercise.title,
                          description: exercise.description,
                          duration: exercise.duration ?? "10 min",
                        });
                      }}
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        deleteItem(
                          `${apiBaseUrl}/api/practice-exercises/${exercise.id}`
                        )
                      }
                      className="rounded-full border border-white/10 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
