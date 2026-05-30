import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT =
    'Generate 3 creative, fun, and open-ended anonymous questions for a mystery message app. ' +
    'Each question should be on a new line, separated by "||". ' +
    'Do not number them. Example format: Question one?||Question two?||Question three?';

export async function POST(): Promise<Response> {
    try {
        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: PROMPT }],
            max_tokens: 200,
        });

        const text = response.choices[0]?.message?.content ?? '';

        return NextResponse.json({ messages: text });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
    }
}
