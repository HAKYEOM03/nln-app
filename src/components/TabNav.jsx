import { NavLink } from 'react-router-dom'
import './TabNav.css'

function TabNav({ basePath }) {
  return (
    <div className="tab-nav">
      <NavLink
        to={`${basePath}/notices`}
        className={({ isActive }) => isActive ? 'tab active' : 'tab'}
      >
        공지사항
      </NavLink>
      <NavLink
        to={`${basePath}/works`}
        className={({ isActive }) => isActive ? 'tab active' : 'tab'}
      >
        작품
      </NavLink>
      <NavLink
        to={`${basePath}/write`}
        className={({ isActive }) => isActive ? 'tab active' : 'tab'}
      >
        작성
      </NavLink>
    </div>
  )
}

export default TabNav
