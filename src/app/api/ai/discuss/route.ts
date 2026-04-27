import { NextResponse } from 'next/server'
import { discussContent, generateDiscussionTitle } from '@/lib/ai/discusser'
import { supabaseAdmin } from '@/lib/db/server'

export async function POST(request: Request) {
  try {
    const { discussionId, message, context } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // If no discussionId provided, create a new discussion
    let currentDiscussionId = discussionId
    
    if (!currentDiscussionId) {
      const title = await generateDiscussionTitle(message)
      const { data: discussion, error: discussionError } = await supabaseAdmin
        .from('ai_discussions')
        .insert({
          title,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (discussionError) throw discussionError
      currentDiscussionId = discussion.id
    }
    
    // Get existing messages for context
    const { data: existingMessages, error: messagesError } = await supabaseAdmin
      .from('discussion_messages')
      .select('*')
      .eq('discussion_id', currentDiscussionId)
      .order('timestamp', { ascending: true })
    
    if (messagesError) throw messagesError
    
    // Build context from existing messages
    const discussionContext: any = {
      discussionId: currentDiscussionId,
      messages: existingMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    }
    
    // Attach idea or competitor if provided in context
    if (context?.attachedIdeaId) {
      discussionContext.attachedIdeaId = context.attachedIdeaId
    }
    if (context?.attachedCompetitorId) {
      discussionContext.attachedCompetitorId = context.attachedCompetitorId
    }
    
    // Process the discussion
    const { response, updatedMessages } = await discussContent(message, discussionContext)
    
    // Save the new messages
    const newMessages = [
      {
        discussion_id: currentDiscussionId,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      },
      {
        discussion_id: currentDiscussionId,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }
    ]
    
    const { data: savedMessages, error: saveError } = await supabaseAdmin
      .from('discussion_messages')
      .insert(newMessages)
      .select()
    
    if (saveError) throw saveError
    
    return NextResponse.json({ 
      response, 
      discussionId: currentDiscussionId,
      messages: [...(existingMessages || []), ...savedMessages]
    })
  } catch (error: any) {
    console.error('Error in discussion:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process discussion' },
      { status: 500 }
    )
  }
}