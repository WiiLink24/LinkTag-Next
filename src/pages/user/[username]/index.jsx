import React from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import safeJsonStringify from 'safe-json-stringify'
import PropTypes from 'prop-types'
import { NextSeo } from 'next-seo'
import { withSession } from '@/lib/iron-session'
import prisma from '@/lib/db'
import RiiTag from '@/components/user/RiiTag'
import UserInformationCard from '@/components/user/UserInformationCard'
import ShowYourTagCard from '@/components/user/ShowYourTagCard'
import ENV from '@/lib/constants/environmentVariables'
import PlayLog from '@/components/user/PlayLog'
import PlayingStatus from '@/components/user/PlayingStatus'
import LanguageContext from '@/components/shared/LanguageContext'
import LocalizedString from '@/components/shared/LocalizedString'
import AppNavbar from '@/components/shared/AppNavbar'

export const getServerSideProps = withSession(async ({ req, query }) => {
  const { username } = query
  // Get the logged in user. This can be null.
  const session = req.session?.username

  const pg = require('pg')
  const { Client } = pg
  const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'riitag',
    port: 2345
  })

  const fix = async (username) => {
    await client.connect()
    const userId = await client.query('SELECT * FROM user WHERE username=$1', [username.toString()])
    const res = await client.query('SELECT * FROM playlog WHERE user_id=$1', [userId.rows[0].id])
    console.log(res.rows) // Hello world!

    for (const row of res.rows) {
      console.log(row)

      const res = await client.query('SELECT * FROM game WHERE game_pk=$1', [row.game_pk])
      if (res.rows.length === 0) {
        console.log('No game found for game_pk', row.game_pk)
        await client.query('DELETE FROM playlog WHERE game_pk=$1', [row.game_pk])
      }
      console.log(res.rows)
    }

    await client.end()
  }

  await fix(username)

  // get user and ban reason
  const user = await prisma.user.findUnique({
    where: {
      username: username.toString()
    },
    select: {
      id: true,
      username: true,
      image: true,
      display_name: true,
      created_at: true,
      overlay: true,
      background: true,
      coin: true,
      flag: true,
      font: true,
      cover_region: true,
      cover_type: true,
      role: true,
      isBanned: true,
      isPublic: true,
      publicOverride: true,
      banned_user: true,
      playlog: {
        select: {
          game: true,
          play_time: true,
          play_count: true,
          played_on: true
        },
        orderBy: {
          played_on: 'desc'
        },
        distinct: ['game_pk']
      },
      game_sessions: {
        select: {
          game: true,
          start_time: true
        }
      }
    }
  })

  // If there's no user, don't continue from here.
  if (!user) {
    return { notFound: true }
  }

  const event = await prisma.events.findFirst({
    where: {
      start_time: {
        lte: new Date()
      },
      end_time: {
        gte: new Date()
      }
    }
  })

  const loggedInUser = session != null
    ? await prisma.user.findUnique({
      where: {
        username: session
      },
      select: {
        role: true,
        language: true
      }
    })
    : { role: 'guest' }

  return {
    props: {
      user: JSON.parse(safeJsonStringify(user)),
      isLoggedIn: user.username === session,
      loggedInUser,
      language: loggedInUser?.language || 'en',
      banReason: JSON.parse(safeJsonStringify(user.banned_user)),
      event: JSON.parse(safeJsonStringify(event)),
      playlog: JSON.parse(safeJsonStringify(user.playlog)),
      session: JSON.parse(safeJsonStringify(user.game_sessions))
    }
  }
})

function ProfilePage ({ user, isLoggedIn, banReason, loggedInUser, event, playlog, language, session }) {
  return (
    <LanguageContext.Helper.Provider value={language}>
      <AppNavbar />
      <Container>
        <NextSeo
          title={user.display_name}
          description={`See what ${user.display_name} has played`}
          openGraph={{
            url: `${ENV.BASE_URL}/user/${user.username}`,
            images: [
              {
                url: `${ENV.BASE_URL}/${user.username}/tag.max.png?${new Date(
                  user.updated_at
                ).getTime()}`,
                width: 1200,
                height: 450,
                alt: `LinkTag of ${user.display_name}`,
                type: 'image/png'
              }
            ],
            profile: {
              username: user.display_name
            }
          }}
        />
        <Row>
          {user.isBanned === 1 ? <Alert variant='danger'><LocalizedString string='banned_reason' values={[banReason.reason]}/></Alert> : ''}

          {user.isBanned === 0
            ? <Col lg={7}>
              <div className='mb-3'>
                <RiiTag
                  username={user.username}
                  name={user.display_name}
                  updated_at={user.updated_at}
                />
              </div>

              <PlayLog playlog={playlog} current={session} />
            </Col>
            : ''}

          <Col lg={user.isBanned ? 12 : 5}>
            {event != null && <Alert variant='info'>An event is currently ongoing: {event.name}.<br />Until {event.date}, you will recieve {event.bonus + 1}x more coins.</Alert>}
            {session instanceof Object && <PlayingStatus session={session} games={session} />}

            <UserInformationCard user={user} isLoggedIn={isLoggedIn} isAdmin={loggedInUser.role === 'admin'} isMod={loggedInUser.role === 'admin' || loggedInUser.role === 'mod'} />
            {isLoggedIn && <ShowYourTagCard username={user.username} />}
          </Col>
        </Row>
      </Container>
    </LanguageContext.Helper.Provider>
  )
}

ProfilePage.propTypes = {
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  event: PropTypes.object,
  banReason: PropTypes.object,
  playlog: PropTypes.array.isRequired,
  session: PropTypes.object,
  game: PropTypes.object.isRequired
}

export default ProfilePage
