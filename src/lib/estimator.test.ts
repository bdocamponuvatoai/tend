import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ESTIMATOR_DEFAULTS,
  estimate,
  formatCurrency,
  formatSignedCompact,
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
  assert.equal(tendMonthlyCost(1), 499);
  assert.equal(tendMonthlyCost(2), 798);
  assert.equal(tendMonthlyCost(14), 5_586);
  assert.equal(tendMonthlyCost(15), 4_485);
  assert.equal(tendMonthlyCost(20), 5_980);
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
