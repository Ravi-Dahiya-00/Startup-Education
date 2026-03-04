import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Content Pages
import Home from './pages/content/Home';
import Blogs from './pages/content/Blogs';
import BlogDetails from './pages/content/BlogDetails';
import Profile from './pages/content/Profile';

// Search
import SearchResults from './pages/search/SearchResults';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Opportunities Pages
import Internships from './pages/opportunities/Internships';
import InternshipDetails from './pages/opportunities/InternshipDetails';
import Jobs from './pages/opportunities/Jobs';
import JobDetails from './pages/opportunities/JobDetails';
import Competitions from './pages/opportunities/Competitions';
import CompetitionDetails from './pages/opportunities/CompetitionDetails';
import Scholarships from './pages/opportunities/Scholarships';
import ScholarshipDetails from './pages/opportunities/ScholarshipDetails';

// Learning Pages
import Courses from './pages/learning/Courses';
import CourseDetails from './pages/learning/CourseDetails';
import Notes from './pages/learning/Notes';
import UploadNote from './pages/learning/UploadNote';
import Practice from './pages/learning/Practice';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInternships from './pages/admin/AdminInternships';
import AdminJobs from './pages/admin/AdminJobs';
import AdminCompetitions from './pages/admin/AdminCompetitions';
import AdminCourses from './pages/admin/AdminCourses';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminScholarships from './pages/admin/AdminScholarships';
import AdminNotes from './pages/admin/AdminNotes';
import JobParser from './pages/admin/JobParser';
import AdminGuard from './components/AdminGuard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        {/* Main Content Area */}
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/:id" element={<CompetitionDetails />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/scholarships/:id" element={<ScholarshipDetails />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:universityId" element={<Notes />} />
            <Route path="/notes/:universityId/:subjectId" element={<Notes />} />
            <Route path="/upload-note" element={<UploadNote />} />
            <Route path="/practice" element={<Practice />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/internships" element={<AdminGuard><AdminInternships /></AdminGuard>} />
            <Route path="/admin/jobs" element={<AdminGuard><AdminJobs /></AdminGuard>} />
            <Route path="/admin/competitions" element={<AdminGuard><AdminCompetitions /></AdminGuard>} />
            <Route path="/admin/courses" element={<AdminGuard><AdminCourses /></AdminGuard>} />
            <Route path="/admin/blogs" element={<AdminGuard><AdminBlogs /></AdminGuard>} />
            <Route path="/admin/scholarships" element={<AdminGuard><AdminScholarships /></AdminGuard>} />
            <Route path="/admin/notes" element={<AdminGuard><AdminNotes /></AdminGuard>} />
            <Route path="/admin/parse-job" element={<AdminGuard><JobParser /></AdminGuard>} />
          </Routes>
        

        <Footer />
      </div>
    </Router>
  );
}

export default App;
