import {
  Outlet, Link, NavLink, useParams, useLocation
} from 'react-router-dom'
import React from 'react'
import { string, bool } from 'prop-types'
import './layout.scss'
// const NavUnlisted = styled.ul`

//

// `
function HeaderLink({ to, active }) {
  const pageTitle = to.split('/')[1].charAt(0).toUpperCase() + to.split('/')[1].slice(1)
  return (
    <NavLink to={to} className={active ? 'navlink-active' : 'navlink'}>
      {pageTitle}
    </NavLink>
  )
}
HeaderLink.propTypes = {
  to: string,
  active: bool
}
HeaderLink.defaultProps = {
  to: '',
  active: false
}
function Layout() {
  const location = useLocation()
  return (
    <>
      <div className="navbar">
        <HeaderLink
          to="/students"
          active={location.pathname === '/students'}
        />
        <HeaderLink
          to="/courses"
          active={location.pathname === '/courses'}
        />
        <HeaderLink
          to={useParams.studentId ? '/enrolment/:studentId' : '/enrolment/1'}
          active={location.pathname.includes('/enrolment/')}
        />
      </div>
      {/* <ul className="navbar">
        <NavLink
          to="/students"
          exact
          activeClassName="active"
        >
          <li>Students</li>
        </NavLink>
        <NavLink
          to="/courses"
          style={({ isActive }) => (isActive
            ? {
              color: '#fff',
              background: '#7600dc'
            }
            : { color: '#8a8b8d', background: '#f0f0f0' })}
          activeClassName="current"
          exact
        >
          <li>Courses</li>
        </NavLink>
        <NavLink
          to={useParams.studentId ? '/enrolment/:studentId' : '/enrolment/1'}
          style={({ isActive }) => (isActive
            ? {
              color: '#fff',
              background: '#7600dc'
            }
            : { color: '#8a8b8d', background: '#f0f0f0' })}
          activeClassName="current"
          exact
        >
          <li>Enrolment</li>
        </NavLink>
      </ul> */}
      <Outlet />
    </>
  )
}
export default Layout
