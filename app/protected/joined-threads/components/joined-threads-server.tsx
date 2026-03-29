import React from 'react'
import { getJoinedThreads } from '../actions'
import JoinedThreadsClient from './joined-threads-client'

const JoinedThreads = async () => {
    const { joinedThreads, nextPage } = await getJoinedThreads(0)

    return (
        <JoinedThreadsClient joinedThreads={joinedThreads} nextPage={nextPage} />
    )
}

export default JoinedThreads