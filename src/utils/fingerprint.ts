import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedVisitorId: string | null = null;

export async function getFingerprint() {
    if (cachedVisitorId) return cachedVisitorId;

    const fp = await FingerprintJS.load();
    const result = await fp.get();

    console.log('visitorid:', result.visitorId)

    cachedVisitorId = result.visitorId;
    return cachedVisitorId;
}