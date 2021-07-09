import { GetStaticProps } from 'next'
import { PageMetaProps } from '../components/global/Head'
import LandingSection from '../components/pages/Home/Landing'

import React from 'react'

const pageMeta: PageMetaProps = {
  title: 'Home | Bounty Board',
  description: 'Bounty Board',
  url: 'https://www.bankless.bounty-board/',
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { pageMeta },
  }
}

const Page = (): JSX.Element => {
  return (
    <React.Fragment>
      <LandingSection />
    </React.Fragment>
  )
}

export default Page
