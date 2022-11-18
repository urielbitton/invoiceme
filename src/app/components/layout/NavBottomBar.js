import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import IconContainer from "../ui/IconContainer"

export default function NavBottomBar() { 

  const { navItem1, navItem2, navItem3, navItemInfo } = useContext(StoreContext)

  return (
    <div className="bottombar">
      {
        navItem1 &&
        <div className="nav-item">
          <IconContainer
            icon={navItem1.icon}
            iconColor="var(--primary)"
            dimensions="30px"
            bgColor="#fff"
            noHover
          />
          <div className="texts">
            <h4>{navItem1.value}</h4>
            <h6>{navItem1.label}</h6>
          </div>
        </div>
      }
      {
        navItem2 &&
        <div className="nav-item">
          <IconContainer
            icon={navItem2.icon}
            iconColor="var(--primary)"
            dimensions="30px"
            bgColor="#fff"
            noHover
          />
          <div className="texts">
            <h4>{navItem2.value}</h4>
            <h6>{navItem2.label}</h6>
          </div>
        </div>
      }
      {
        navItem3 &&
        <div className="nav-item">
          <IconContainer
            icon={navItem3.icon}
            iconColor="var(--primary)"
            dimensions="30px"
            bgColor="#fff"
            noHover
          />
          <div className="texts">
            <h4>{navItem3.value}</h4>
            <h6>{navItem3.label}</h6>
          </div>
        </div>
      }
      {
        navItemInfo &&
        <div className="nav-item-info">

        </div>
      }
    </div>
  )
}
