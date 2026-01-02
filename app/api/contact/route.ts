import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, topic, message } = await request.json();

        // Basic validation
        if (!name || !email || !topic || !message) {
            return NextResponse.json(
                { error: 'Please fill in all required fields' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Send email
        const result = await sendContactEmail({
            name,
            email,
            phone,
            topic,
            message,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send message' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
        });
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again later.' },
            { status: 500 }
        );
    }
}
