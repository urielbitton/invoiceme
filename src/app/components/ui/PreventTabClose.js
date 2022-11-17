import React, { useEffect } from "react"

export default function PreventTabClose({preventClose}) {

  const eventReturnValue = (e) => {
    return e.returnValue = 'You have unsaved changes. Are you sure you want to close the tab?'
  }

  useEffect(() => {
    if(preventClose) {
      window.addEventListener("beforeunload", eventReturnValue) 
    }
    return () => window.removeEventListener("beforeunload", eventReturnValue)
  }, [preventClose])
 
  return (
    <></>
  )
}
