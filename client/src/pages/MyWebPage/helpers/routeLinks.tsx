import { paths } from 'constants/routes'
import Button from 'library/Button/Button'
import React from 'react'
import { CiTrophy, CiGift, CiVault, CiMonitor } from 'react-icons/ci'
import { useParams } from 'react-router-dom'

const RouteLinks: React.FC = () => {
    const { user } = useParams()
    const RouteLinks = [
        {
            icon: <CiTrophy />,
            onclick: () => window.open(
                "https://agent.comfortfinancialsolutions.com/signup"
            ),
            text: <>Be a <br /> CFS Agent</>
        },
        {
            icon: <CiGift />,
            onclick: () => window.open(`${paths.subscriberRegistration}?userGuid=${user}`),
            text: <>Earn Points <br /> as a CFS Subscriber</>
        },
        {
            icon: <CiVault />,
            onclick: () => window.open(`${paths.portalRegistration}?userGuid=${user}`),
            text: <>Try CFS <br /> for 30-days</>
        },
        // {
        //     icon: <CiMonitor />,
        //     onclick: () => window.open(paths.webinarPage.replace(':user', user ?? '')),
        //     text: <>Join our webinar <br /> to learn more</>
        // },
        /*   Doesn't have a function yet, get from marketing.*/
    ]
    return (
        <>
            {RouteLinks.map((route) => (
                <>
                    <Button onClick={route.onclick}>
                        <div className="icon-holder">
                            {route.icon}
                        </div>
                        {route.text}
                    </Button>
                </>
            ))}
        </>
    )
}

export default RouteLinks