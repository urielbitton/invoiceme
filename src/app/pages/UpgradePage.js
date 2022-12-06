import AppButton from "app/components/ui/AppButton"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect } from 'react'
import './styles/UpgradePage.css'
import upgradeImg from 'app/assets/images/upgrade-img.png'
import { plansData } from "app/data/plans"

export default function UpgradePage() {

  const { myMemberType, setCompactNav } = useContext(StoreContext)

  const plansList = plansData.map((plan, index) => {
    return <PlanItem
      key={index}
      plan={plan}
    />
  })

  useEffect(() => {
    setCompactNav(true)
    return () => setCompactNav(false)
  }, [])

  return (
    <div className="upgrade-page">
      <HelmetTitle title="Upgrade To Business" />
      {
        myMemberType === 'business' ? (
          <>
            <h4>You are already a business member</h4>
            <br />
            <AppButton
              label="My Account"
              url="/my-account"
            />
          </>
        ) : (
          <div className="upgrade-content">
            <img src={upgradeImg} alt="upgrade" />
            <h4>Upgrade to Business</h4>
            <p>
              Upgrade to a business account and take advantage of a multitude of advanced features<br/>
              including automated invoices, in-app payments, invoices by sms and more.
            </p>
            <div className="plans-flex">
              {plansList}
            </div>
          </div>
        )
      }
    </div>
  )
}

export function PlanItem(props) {

  const { myMemberType } = useContext(StoreContext)
  const { planID, name, price, description, features } = props.plan
  const activePlan = myMemberType === planID

  const featuresList = features.map((feature, index) => {
    return <h6
      key={index}
    >
      {feature}
      <i className="fas fa-check-circle" />
    </h6>
  })

  return (
    <div className="plan-item">
      <div className="plan-details">
        <h5>{name}</h5>
        <small>{description}</small>
        {
          price > 0 ? 
          <big><sup>$</sup>{price}<sub>/ month</sub></big> :
          <big>Free</big>
        }
        <AppButton
          label={activePlan ? "Active" : "Upgrade Now"}
          buttonType={activePlan ? "outlineBlueBtn" : "primary"}
          url={activePlan ? null : "/upgrade-checkout"}
        />
      </div>
      <div className="plan-list">
        {featuresList}
      </div>
    </div>
  )
}