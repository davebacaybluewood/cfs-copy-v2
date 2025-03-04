import React from 'react'
import { FaPhone, FaAddressCard, FaLanguage } from 'react-icons/fa'
import { HiLocationMarker } from 'react-icons/hi'
import { MdEmail } from 'react-icons/md'

const contactLinks = (address: string, phoneNumber: string, email: string, licenseNumber: string, languages: string) => {
    return [
        {
            icon: address ? <HiLocationMarker /> : '',
            text: address ?? ''
        },
        {
            icon: phoneNumber === '' ? <></> : <FaPhone />,
            text: phoneNumber ?? ''
        },
        {
            icon: email ? <MdEmail /> : '',
            text: email ? email : ''
        },
        {
            icon: licenseNumber ? <FaAddressCard /> : "",
            text: licenseNumber ?? ''
        },
        {
            icon: languages ? <FaLanguage /> : '',
            text: languages ?? ''
        },
    ]
}

export default contactLinks