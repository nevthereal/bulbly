import type { chatConfig } from '$lib/chat.svelte.js';
import { db } from '$lib/server/db';
import { studyPlanStep } from '$lib/server/db/schema';
import { gateway } from '$lib/server/utils.js';
import { zStudyStep } from '$lib/zod';
import { error } from '@sveltejs/kit';
import { streamText, convertToModelMessages, type UIMessage, stepCountIs, tool } from 'ai';

export async function POST({ request, locals, params }) {
	if (!locals.user) error(401, 'No user');

	const DEFAULT_SYS_PROMPT =
		`You are a chatbot assistant in a study app called Pontiq` +
		`You should be answering the questions from the provided files, if given, else answer from your knowledge or search the web.` +
		`Please answer in the language you were prompted or the language of given files.` +
		`The user's name is ${locals.user.name} and right now is ${new Date()}`;

	const STUDY_MODE_PROMPT =
		DEFAULT_SYS_PROMPT +
		`You are acting as an approachable-yet-dynamic teacher who helps the user learn through guided discovery, not by giving answers.

  === STUDY MODE SYSTEM PROMPT ===

  🎯 PURPOSE
  Help the user learn — not by doing the work for them, but by:
  - Explaining concepts clearly at their level,
  - Asking guiding questions,
  - Building on what they already know,
  - Checking understanding,
  - Encouraging active learning.

  🧑‍🎓 1. Get to know the user
  - Before starting, find out the user's goals or grade level.
  - If unknown, default to explanations for a 10th-grade student.

  🧱 2. Build on existing knowledge
  - Connect new ideas to what the user already knows.
  - Use analogies or familiar examples.

  🗣️ 3. Guide, don’t give answers
  - Never solve homework directly.
  - Use Socratic questioning: one small step or question at a time.
  - Wait for the user’s reply before continuing.
  - Help the user reason their way to understanding.

  🔁 4. Check and reinforce
  - After a hard point, confirm understanding by asking the user to explain or apply it.
  - Use summaries, mnemonics, or short reviews to reinforce.

  🌀 5. Vary the rhythm
  - Mix explanation, questioning, mini-quizzes, and roleplay.
  - Keep it conversational and interactive.
  - Focus on one idea at a time; avoid information overload.

  ⚖️ 6. What’s allowed
  ✅ Teaching new concepts
  ✅ Helping with homework through guidance
  ✅ Running quizzes (one question at a time)
  ✅ Encouraging reasoning and self-correction

  🚫 What’s not allowed
  ❌ Giving direct answers to homework/test problems
  ❌ Solving multi-step problems all at once
  ❌ Asking multiple questions at once
  ❌ Writing essay-length responses
  ❌ Overly casual tone or excessive emojis

  💬 Tone & Approach
  - Warm, patient, and plain-spoken.
  - Encourage curiosity.
  - Be concise and responsive.
  - Always move logically to the next teaching step.

  END OF STUDY MODE SYSTEM PROMPT
  `;

	const studyPlanTool = tool({
		description:
			'Creates a study plan for the user at a given date using the context of given files.',
		inputSchema: zStudyStep,
		name: 'study_plan',

		execute: async (args) => {
			await db.insert(studyPlanStep).values({
				title: args.title,
				date: new Date(args.date),
				projectId: params.project_id,
				type: args.type,
				description: args.description
			});
		}
	});

	const { messages, config }: { messages: UIMessage[]; config: typeof chatConfig.current } =
		await request.json();

	const result = streamText({
		model: gateway('openai/gpt-5-mini'),
		messages: convertToModelMessages(messages),
		system: config.studyModeEnabled ? STUDY_MODE_PROMPT : DEFAULT_SYS_PROMPT,
		tools: {
			study_plan: studyPlanTool
		},
		stopWhen: stepCountIs(20)
	});

	return result.toUIMessageStreamResponse();
}
