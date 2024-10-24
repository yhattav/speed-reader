export function debounce<F extends (...args: any[]) => any>(
    func: F,
    wait: number,
    options: { leading?: boolean; trailing?: boolean } = { leading: false, trailing: true }
): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<F> | null = null;
    let lastThis: any;
    let result: any;

    const invokeFunc = () => {
        if (lastArgs) {
            result = func.apply(lastThis, lastArgs);
            lastArgs = lastThis = null;
        }
    };

    const debounced = function(this: any, ...args: Parameters<F>) {
        lastArgs = args;
        lastThis = this;

        if (timeout !== null) {
            clearTimeout(timeout);
        }

        const shouldCallNow = options.leading && !timeout;
        timeout = setTimeout(() => {
            timeout = null;
            if (options.trailing) {
                invokeFunc();
            }
        }, wait);

        if (shouldCallNow) {
            invokeFunc();
        }
    };

    return debounced;
}

export function throttle<F extends (...args: any[]) => any>(
    func: F,
    limit: number,
    options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true }
): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<F> | null = null;
    let lastThis: any;
    let result: any;
    let lastCallTime: number | null = null;

    const invokeFunc = () => {
        if (lastArgs) {
            result = func.apply(lastThis, lastArgs);
            lastArgs = lastThis = null;
        }
    };

    const throttled = function(this: any, ...args: Parameters<F>) {
        const now = Date.now();
        if (!lastCallTime && options.leading === false) {
            lastCallTime = now;
        }

        const remaining = limit - (now - (lastCallTime || 0));
        lastArgs = args;
        lastThis = this;

        if (remaining <= 0 || remaining > limit) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            lastCallTime = now;
            if (options.leading !== false) {
                invokeFunc();
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(() => {
                lastCallTime = options.leading === false ? null : Date.now();
                timeout = null;
                invokeFunc();
            }, remaining);
        }
    };

    return throttled;
}

export function isOverElement(element: HTMLElement, event: MouseEvent): boolean {
    const rect = element.getBoundingClientRect();
    return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
    );
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
