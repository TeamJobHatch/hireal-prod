import ShowJobPositions from '../ManageJobPosition/ShowJobPositions'
import ManageResumes from '../ManageResume/ManageResumes'
import MatchHistory from '../ResumeJobMatch/matchHistory'
import MyPlans from '../ManageSubPlan/myPlan'
import './UserHome.css';

const UserHome = () => {
  return (
    <div className="user-home-page">
      <div className="user-home-container">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to Your Dashboard</h1>
          <p className="welcome-subtitle">Manage your job search and resume analysis all in one place</p>
        </div>

        <div className="dashboard-grid">
          <ShowJobPositions />
          <ManageResumes />
          <MyPlans />
          <MatchHistory />
        </div>
      </div>
    </div>
  );
};

export default UserHome;
