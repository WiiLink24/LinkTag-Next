import { React } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import useInfo from '@/lib/swr-hooks/useInfo'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function DonorButton ({ isDonor, id }) {
  const router = useRouter()
  const { mutate } = useInfo()

  const setDonor = async (status) => {
    const response = await fetch('/api/account/donor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        user: id
      })
    })
    if (response.status === 200) {
      toast.success('The account has been set to donor.')
      mutate()
      router.reload()
    } else {
      toast.error('An error occured, please try again later.')
    }
  }

  return (
      <Button variant={isDonor ? 'danger' : 'primary'} onClick={() => setDonor(!isDonor)}>
        {isDonor ? 'Remove Donor Status' : 'Set Donor'}
      </Button>
  )
}

DonorButton.propTypes = {
  id: PropTypes.number.isRequired,
  isDonor: PropTypes.bool.isRequired
}
