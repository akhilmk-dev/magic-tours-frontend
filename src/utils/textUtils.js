import React from 'react';

/**
 * Renders a string with highlighted parts wrapped in a span.
 * Uses [[text]] as the delimiter for highlights.
 * 
 * @param {string} text - The input text with [[highlight]] tags.
 * @param {string} highlightClass - The CSS class to apply to highlighted parts.
 * @returns {React.ReactNode} - Rendered React elements.
 */
export const renderDynamicTitle = (text, highlightClass = "text-brand-magic italic") => {
    if (!text) return null;
    
    // Split by [[...]] pattern
    const parts = text.split(/\[\[(.*?)\]\]/);
    
    return parts.map((part, i) => {
        // Handle newlines in plain text parts (both real newlines and literal \n)
        const content = part.split(/\n|\\n/).map((line, j, array) => (
            <React.Fragment key={j}>
                {line}
                {j < array.length - 1 && <br />}
            </React.Fragment>
        ));

        // Odd indices are the captured groups (highlights)
        if (i % 2 === 1) {
            return (
                <span key={i} className={highlightClass}>
                    {content}
                </span>
            );
        }
        // Even indices are regular text
        return content;
    });
};
