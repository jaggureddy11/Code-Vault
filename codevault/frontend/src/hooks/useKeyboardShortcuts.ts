import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutConfig {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    action: () => void;
    description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            shortcuts.forEach((shortcut) => {
                const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatch = shortcut.ctrlKey ? (e.ctrlKey || e.metaKey) : true;

                // If shortcut specifies ctrlKey: true, it MUST be pressed.
                // If not specified, we don't care or assume false? 
                // Let's be more precise.
                const ctrlPressed = (e.ctrlKey || e.metaKey);
                const shiftPressed = e.shiftKey;

                if (keyMatch &&
                    (shortcut.ctrlKey === undefined || shortcut.ctrlKey === ctrlPressed) &&
                    (shortcut.shiftKey === undefined || shortcut.shiftKey === shiftPressed)) {

                    // Avoid triggering shortcuts when typing in inputs/textareas
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                        // Exceptions: some shortcuts might be allowed in inputs (like Cmd+S which we handle in form)
                        // But for global navigation ones, usually we skip.
                        if (shortcut.key !== 's' && shortcut.key !== 'enter') {
                            return;
                        }
                    }

                    e.preventDefault();
                    shortcut.action();
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}
