import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { StoreContext } from 'app/store/store'

export default function MenuLink(props) {

  const { myUser } = useContext(StoreContext)
  const { link, tabOpen, setTabOpen } = props

  return (
    <>
      <NavLink 
        to={link.url} 
        onClick={(e) => link.sublinks && (setTabOpen(prev => !prev), e.preventDefault()) }
      >
        <div className={`menu-item ${link.sublinks ? "expands" : ''}`}>
          <div className="titles">
            <i className={link.icon}></i>
            <h6>{link.name}</h6>
          </div>
          {link.sublinks && <i className={`fal fa-angle-up ${tabOpen ? "open" : ''}`}></i>}
        </div>
      </NavLink>
      {
        link.sublinks &&
        <div className={`sub-menu-container ${tabOpen ? "open" : ''}`}>
          {
            link.sublinks?.map(sublink => {
              return <NavLink 
                to={sublink.url} 
                className="sub-menu-link"
                key={sublink.url}
              >
                <div className={`menu-item ${link.sublinks && "expands"}`}>
                  <div className="titles">
                    <i className={sublink.icon}></i>
                    <h6>{sublink.name}</h6>
                  </div>
                  <hr />
                </div>
              </NavLink>
            })
          }
        </div>
      }
    </>
  )
}
