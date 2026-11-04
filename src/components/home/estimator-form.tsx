"use client";

import { useState, type CSSProperties } from "react";
import {
  ESTIMATOR_DEFAULTS,
  estimate,
  formatCurrency,
  formatSignedCompact,
  type EstimatorInput,
} from "@/lib/estimator";

type SliderProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  format?: (value: number) => string;
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
  onChange,
}: SliderProps) {
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
        style={{ "--p": (value - min) / (max - min) } as CSSProperties}
      />
      <div className="estimator-range" aria-hidden="true">
        <span>{format(min)}</span>
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
  const update = (key: keyof EstimatorInput) => (value: number) =>
    setInput((previous) => ({ ...previous, [key]: value }));

  const breakdown = [
    {
      label: `Revenue lift (+${input.ticketLiftPercent}% tickets)`,
      value: result.revenueLift,
      tone: "lift",
    },
    {
      label: "Vendor consolidation est.",
      value: result.vendorSavings,
      tone: "savings",
    },
    { label: "Tend subscription", value: -result.tendCost, tone: "cost" },
  ];

  return (
    <div className="estimator-grid">
      <form
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
            max={20}
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
            onChange={update("ticketLiftPercent")}
          />
        </fieldset>
        <div className="estimator-revenue">
          <span>CURRENT MONTHLY REVENUE</span>
          {/* Readable, but not announced on every slider step: the annual
              gain below is the one live result. */}
          <output aria-live="off">
            {formatCurrency(result.monthlyRevenue)}
          </output>
        </div>
      </form>

      <div className="estimator-results">
        <span className="estimator-kicker">ESTIMATED ANNUAL GAIN</span>
        <p className="estimator-caption">Net of Tend subscription</p>
        <p className="estimator-total" aria-live="polite" aria-atomic="true">
          {formatCurrency(result.annualNet)}
        </p>
        <p className="estimator-caption">
          {`at ${input.ticketLiftPercent}% ticket lift assumption`}
        </p>
        <dl className="estimator-split">
          <div>
            <dt>Monthly net gain</dt>
            <dd>{formatCurrency(result.monthlyNet)}</dd>
          </div>
          <div>
            <dt>Tend cost / mo</dt>
            <dd>{formatCurrency(result.tendCost)}</dd>
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
    </div>
  );
}
