import { EventType } from '@/types';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  let sid = window.sessionStorage.getItem('synta_session_id');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    window.sessionStorage.setItem('synta_session_id', sid);
  }
  return sid;
}

export function getStoredReaderId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('synta_reader_id');
}

export function getStoredReaderEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('synta_reader_email');
}

export function storeReaderData(id: string, email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('synta_reader_id', id);
  window.localStorage.setItem('synta_reader_email', email);
  window.localStorage.setItem('synta_unlocked_story', 'true');
}

export function isStoryUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('synta_unlocked_story') === 'true';
}

const firedOncePerSession = new Set<string>();

export async function trackEvent(
  event: EventType,
  metadata?: Record<string, unknown>,
  options?: { oncePerSession?: boolean }
): Promise<void> {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();
  const readerId = getStoredReaderId();

  if (options?.oncePerSession) {
    const key = `${sessionId}:${event}`;
    if (firedOncePerSession.has(key)) return;
    firedOncePerSession.add(key);
  }

  const payload = {
    session_id: sessionId,
    reader_id: readerId || undefined,
    event,
    metadata: metadata || {},
    created_at: new Date().toISOString(),
  };

  try {
    // Non-blocking beacon or fetch call
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/events', JSON.stringify(payload));
    } else {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently swallow analytics errors to avoid reader disruption
      });
    }
  } catch {
    // Analytics should never break UI
  }
}
