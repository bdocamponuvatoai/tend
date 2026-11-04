"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ESTIMATOR_DEFAULTS,
  MAX_ESTIMATOR_LOCATIONS,
  RESEARCH_TICKET_LIFT_RANGE,
  estimate,
  formatCurrency,
  formatSignedCompact,
  type EstimatorInput,
} from "@/lib/estimator";
import { usePrefersReducedMotion, useTweened } from "@/lib/use-tweened";

type SliderProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  format?: (value: number) => string;
  /** A range to mark on the track, e.g. what the research reports. */
  band?: readonly [number, number];
  onChange: (value: number) => void;
};

function Slider({
  id,
  label,
  min,
  max,
  step,
  value,
  format = String,
  band,
  onChange,
}: SliderProps) {
  const at = (n: number) => (n - min) / (max - min);
  return (
    <div className="estimator-field">
      <div className="estimator-field-top">
        <label htmlFor={id}>{label}</label>
        {/* Visual readout only: the slider announces its own value
            (aria-valuetext), and <output> would announce it a second time. */}
        <output htmlFor={id} aria-hidden="true">
          {format(value)}
        </output>
      </div>
      <div className="estimator-track">
        {band && (
          <span
            className="estimator-band"
            aria-hidden="true"
            style={
              { "--from": at(band[0]), "--to": at(band[1]) } as CSSProperties
            }
          />
        )}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format(value)}
          onChange={(event) => onChange(Number(event.target.value))}
          // Position 0–1 for the filled track; WebKit has no native progress part.
          style={{ "--p": at(value) } as CSSProperties}
        />
      </div>
      <div className="estimator-range" aria-hidden="true">
        <span>{format(min)}</span>
        {band && (
          <span
            className="estimator-range-band"
            style={{ "--mid": at((band[0] + band[1]) / 2) } as CSSProperties}
          >
            {`${band[0]}–${format(band[1])}`}
          </span>
        )}
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

const dollars = (value: number) => `$${value}`;
const percent = (value: number) => `${value}%`;

export function EstimatorForm() {
  const [input, setInput] = useState<EstimatorInput>(ESTIMATOR_DEFAULTS);
  const result = estimate(input);
  const total = formatCurrency(result.annualNet);
  const update = (key: keyof EstimatorInput) => (value: number) =>
    setInput((previous) => ({ ...previous, [key]: value }));

  // Figures glide to their new values; the live region below announces
  // only the final total.
  const shown = useTweened({
    revenue: result.monthlyRevenue,
    total: result.annualNet,
    monthlyNet: result.monthlyNet,
    tendCost: result.tendCost,
    lift: result.revenueLift,
    savings: result.vendorSavings,
  });
  const shownTotal = formatCurrency(shown.total);

  const breakdown = [
    {
      label: `Revenue lift (+${input.ticketLiftPercent}% tickets)`,
      value: shown.lift,
      tone: "lift",
    },
    {
      label: "Vendor consolidation est.",
      value: shown.savings,
      tone: "savings",
    },
    { label: "Tend subscription", value: -shown.tendCost, tone: "cost" },
  ];

  // Phones: while the sliders are on screen and the annual gain is not, a
  // bar at the foot of the screen keeps the figure in view.
  const inputsRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLParagraphElement>(null);
  const [docked, setDocked] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  useEffect(() => {
    const inputs = inputsRef.current;
    const figure = totalRef.current;
    if (!inputs || !figure) return;
    const inView = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          inView.set(entry.target, entry.isIntersecting);
        setDocked(!!inView.get(inputs) && !inView.get(figure));
      },
      // The figure counts as seen once it is clear of the bar (~100px).
      { rootMargin: "0px 0px -100px 0px" },
    );
    observer.observe(inputs);
    observer.observe(figure);
    return () => observer.disconnect();
  }, []);
  const showResults = () =>
    resultsRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

  return (
    <div className="estimator-grid">
      <form
        ref={inputsRef}
        className="estimator-inputs"
        aria-label="Your restaurant"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset>
          <legend>YOUR OPERATION</legend>
          <Slider
            id="estimator-locations"
            label="Locations"
            min={1}
            max={MAX_ESTIMATOR_LOCATIONS}
            step={1}
            value={input.locations}
            onChange={update("locations")}
          />
          <Slider
            id="estimator-covers"
            label="Covers per night"
            min={40}
            max={400}
            step={10}
            value={input.coversPerNight}
            onChange={update("coversPerNight")}
          />
          <Slider
            id="estimator-ticket"
            label="Average ticket"
            min={20}
            max={150}
            step={1}
            value={input.averageTicket}
            format={dollars}
            onChange={update("averageTicket")}
          />
        </fieldset>
        <fieldset>
          <legend>YOUR ASSUMPTION</legend>
          <Slider
            id="estimator-lift"
            label="Ticket lift from self-ordering"
            min={0}
            max={30}
            step={1}
            value={input.ticketLiftPercent}
            format={percent}
            band={RESEARCH_TICKET_LIFT_RANGE}
            onChange={update("ticketLiftPercent")}
          />
        </fieldset>
        <div className="estimator-revenue">
          <span>CURRENT MONTHLY REVENUE</span>
          {/* Readable, but not announced on every slider step: the annual
              gain below is the one live result. */}
          <output aria-live="off">{formatCurrency(shown.revenue)}</output>
        </div>
      </form>

      <div ref={resultsRef} className="estimator-results">
        <span className="estimator-kicker">ESTIMATED ANNUAL GAIN</span>
        <p className="estimator-caption">Net of Tend subscription</p>
        <p
          ref={totalRef}
          className="estimator-total"
          // Character count, so the figure can shrink to fit its panel when
          // the sliders push it to nine digits (styles/sections/estimator.css).
          style={
            {
              "--chars": Math.max(total.length, shownTotal.length),
            } as CSSProperties
          }
        >
          <span aria-hidden="true">{shownTotal}</span>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {total}
          </span>
        </p>
        <p className="estimator-caption">
          {`at ${input.ticketLiftPercent}% ticket lift assumption`}
        </p>
        <dl className="estimator-split">
          <div>
            <dt>Monthly net gain</dt>
            <dd>{formatCurrency(shown.monthlyNet)}</dd>
          </div>
          <div>
            <dt>Tend cost / mo</dt>
            <dd>{formatCurrency(shown.tendCost)}</dd>
          </div>
        </dl>
        <div className="estimator-breakdown">
          <span>MONTHLY BREAKDOWN</span>
          <dl>
            {breakdown.map((row) => (
              <div key={row.tone} data-tone={row.tone}>
                <dt>{row.label}</dt>
                <dd>{formatSignedCompact(row.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Visual shortcut only (the total is announced above), so it stays
          out of the tab order and the accessibility tree. */}
      <button
        type="button"
        className="estimator-dock"
        aria-hidden="true"
        tabIndex={-1}
        data-visible={docked ? "" : undefined}
        onClick={showResults}
      >
        <span>
          <span className="estimator-dock-label">ESTIMATED ANNUAL GAIN</span>
          <strong>{shownTotal}</strong>
        </span>
        <ArrowDown size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
}
