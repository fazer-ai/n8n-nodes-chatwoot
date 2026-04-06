import { createHmac, timingSafeEqual } from 'crypto';

const DEFAULT_TOLERANCE_SECONDS = 300;

interface VerifyParams {
	secret: string;
	signatureHeader: string | undefined;
	timestampHeader: string | undefined;
	rawBody: string;
	toleranceSeconds?: number;
}

interface VerifyResult {
	valid: boolean;
	reason?: string;
}

export function verifyWebhookSignature({
	secret,
	signatureHeader,
	timestampHeader,
	rawBody,
	toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
}: VerifyParams): VerifyResult {
	if (!signatureHeader) {
		return { valid: false, reason: 'Missing X-Chatwoot-Signature header' };
	}

	if (!timestampHeader) {
		return { valid: false, reason: 'Missing X-Chatwoot-Timestamp header' };
	}

	const timestamp = parseInt(timestampHeader, 10);
	if (Number.isNaN(timestamp)) {
		return { valid: false, reason: 'Invalid X-Chatwoot-Timestamp value' };
	}

	const now = Math.floor(Date.now() / 1000);
	if (Math.abs(now - timestamp) > toleranceSeconds) {
		return { valid: false, reason: 'Timestamp outside tolerance window' };
	}

	const signedPayload = `${timestamp}.${rawBody}`;
	const computedHex = createHmac('sha256', secret).update(signedPayload).digest('hex');
	const expectedSignature = `sha256=${computedHex}`;

	if (expectedSignature.length !== signatureHeader.length) {
		return { valid: false, reason: 'Invalid signature' };
	}

	const isValid = timingSafeEqual(
		Buffer.from(expectedSignature),
		Buffer.from(signatureHeader),
	);

	if (!isValid) {
		return { valid: false, reason: 'Invalid signature' };
	}

	return { valid: true };
}
