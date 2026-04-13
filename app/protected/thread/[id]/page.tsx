import { getReplies, getThread } from './actions'
import ThreadClient from './components/thread-client'
import { RealtimeProvider } from './components/thread-realtime-context'



const ThreadPage = async ({ params }: { params: Promise<{ id: string }> }) => {

    const param = await params
    const threadId = Number(param.id)


    const [threadData, threadReplies] = await Promise.all([
        getThread(threadId),
        getReplies(threadId, -1)
    ])

    return (
        <RealtimeProvider>
            <ThreadClient
                thread={threadData.thread}
                members={threadData.members}
                replies={threadReplies.data}
                nextCursor={threadReplies.nextCursor}
            />
        </RealtimeProvider>
    )
}

export default ThreadPage