import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Movies from './pages/Movies/Movies';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import MovieDiscussions from './pages/MovieDiscussions/MovieDiscussions';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Profile from './pages/Profile/Profile';
import People from './pages/People/People';
import UserProfile from './pages/UserProfile/UserProfile';
import Feed from './pages/Feed/Feed';
import Notifications from './pages/Notifications/Notifications';
import Watchlist from './pages/Watchlist/Watchlist';
import Collections from './pages/Collections/Collections';
import CollectionDetails from './pages/CollectionDetails/CollectionDetails';
import Messages from './pages/Messages/Messages';
import Search from './pages/Search/Search';

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/movies/:id/discussions" element={<MovieDiscussions />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/people" element={<People />} />
      <Route path="/people/:username" element={<UserProfile />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/collections/:id" element={<CollectionDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

