import { signOut } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { Link } from "react-router-dom"
import Avatar from "../ui/Avatar"

export default function ProfileDropdown(props) {

  const { setPageLoading, myUserImg, myMemberType, myUserName } = useContext(StoreContext)
  const { showMenu, setShowMenu } = props

  return (
    <div className="profile-container">
      <div
        className="clickable-profile"
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(prev => prev === 'profile' ? null : 'profile')
        }}
      >
        <Avatar
          src={myUserImg}
          dimensions="30px"
          alt="profile"
          border="1.5px solid #fff"
        />
        <i className="fal fa-angle-down" />
      </div>
      <div className={`profile-dropdown ${showMenu === 'profile' ? 'show' : ''}`}>
        <Link to="/my-account">
          <i className="fas fa-user-circle" />
          <span>My Account</span>
        </Link>
        {
          myMemberType !== 'business' &&
          <Link to="/upgrade">
            <i className="fas fa-rocket-launch" />
            <span>Upgrade</span>
          </Link>
        }
        <Link to="help-and-support">
          <i className="fas fa-question-circle" />
          <span>Help & Support</span>
        </Link>
        <Link to="/settings">
          <i className="fas fa-cog" />
          <span>Settings</span>
        </Link>
        <h6 onClick={() => signOut(setPageLoading)}>
          <i className="fas fa-sign-out" />
          <span>Sign Out</span>
        </h6>
        <hr />
        <div className="info">
          <span>Profile Name:</span>
          <span className="capitalize value">{myUserName}</span>
        </div>
        <div className="info">
          <span>Account Type:</span>
          <span className="capitalize value">{myMemberType}</span>
        </div>
      </div>
    </div>
  )
}
