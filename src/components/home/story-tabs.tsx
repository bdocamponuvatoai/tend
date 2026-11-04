"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type Story = {
  id: string;
  number: string;
  label: string;
  panel: ReactNode;
};

/**
 * WAI-ARIA tabs with automatic activation: click, ←/→ to move, Home/End to
 * jump. Each panel also has previous/next buttons, which move focus to the
 * newly selected tab. All panels stay in the DOM (hidden), so their copy is
 * in the static HTML.
 */
export function StoryTabs({
  stories,
  label,
}: {
  stories: Story[];
  label: string;
}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = stories.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  };

  return (
    <>
      <div className="story-tabs" role="tablist" aria-label={label}>
        {stories.map((story, index) => (
          <button
            key={story.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`tab-${story.id}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`story-${story.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span>{story.number}</span>
            {` ${story.label}`}
          </button>
        ))}
      </div>
      {stories.map((story, index) => {
        const prev = index === 0 ? stories.length - 1 : index - 1;
        const next = index === stories.length - 1 ? 0 : index + 1;
        return (
          <div
            key={story.id}
            className="story-panel tile tile--tabbed"
            id={`story-${story.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${story.id}`}
            tabIndex={0}
            hidden={index !== active}
          >
            {story.panel}
            {/* Previous / next, in the panel's folder-tab corner. */}
            <div className="tile-tab story-nav">
              <button
                type="button"
                className="tile-arrow"
                aria-label={`Previous: ${stories[prev].label}`}
                onClick={() => select(prev)}
              >
                <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="tile-arrow tile-arrow--solid"
                aria-label={`Next: ${stories[next].label}`}
                onClick={() => select(next)}
              >
                <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
