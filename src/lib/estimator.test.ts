import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ESTIMATOR_DEFAULTS,
  estimate,
  formatCurrency,
  formatSignedCompact,
  MAX_ESTIMATOR_LOCATIONS,
  TEND_PRICING,
  tendMonthlyCost,
} from "./estimator.ts";

test("defaults match the original estimator", () => {
  assert.deepEqual(estimate(ESTIMATOR_DEFAULTS), {
    monthlyRevenue: 161_280, // 1 × 120 × $48 × 28 nights
    revenueLift: 24_192, // 15%
    vendorSavings: 250,
    tendCost: 499,
    monthlyNet: 23_943,
    annualNet: 287_316,
  });
});

test("Tend cost tiers by location count", () => {
  // 1–4: $499, 5–14: $449, 15–24: $399 per location per month.
  assert.equal(tendMonthlyCost(1), 499);
  assert.equal(tendMonthlyCost(4), 1_996);
  assert.equal(tendMonthlyCost(5), 2_245);
  assert.equal(tendMonthlyCost(14), 6_286);
  assert.equal(tendMonthlyCost(15), 5_985);
  assert.equal(tendMonthlyCost(20), 7_980);
  assert.equal(tendMonthlyCost(24), 9_576);
});

test("25 or more locations are quoted, not priced", () => {
  assert.throws(() => tendMonthlyCost(25), RangeError);
  // The estimator never asks for a quoted size.
  assert.ok(MAX_ESTIMATOR_LOCATIONS < TEND_PRICING.quoteFromLocations);
});

test("net can be negative at the low end", () => {
  const result = estimate({
    locations: 1,
    coversPerNight: 40,
    averageTicket: 20,
    ticketLiftPercent: 0,
  });
  assert.equal(result.monthlyNet, -249);
  assert.equal(result.annualNet, -2_988);
});

test("formatting", () => {
  assert.equal(formatCurrency(287_316), "$287,316");
  assert.equal(formatCurrency(-2_988), "−$2,988");
  assert.equal(formatSignedCompact(24_192), "+$24k");
  assert.equal(formatSignedCompact(4_838.4), "+$4.8k");
  assert.equal(formatSignedCompact(250), "+$250");
  assert.equal(formatSignedCompact(-499), "−$499");
});
