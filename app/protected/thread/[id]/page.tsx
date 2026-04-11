import { getReplies, getThread } from './actions'
import ThreadClient from './components/thread-client'

const ThreadPage = async ({ params }: { params: Promise<{ id: string }> }) => {

    const param = await params
    const threadId = Number(param.id)

    const { thread, members } = await getThread(threadId);
    const [threadData, threadReplies] = await Promise.all([
        getThread(threadId),
        getReplies(threadId, -1)
    ])

    return (
        <ThreadClient
            thread={threadData.thread}
            members={threadData.members}
            replies={threadReplies.data}
            nextCursor={threadReplies.nextCursor}
        />
    )
}

export default ThreadPage