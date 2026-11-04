/**
 * Industry-data estimator maths, ported unchanged from the original Tend
 * restaurant site. Framework-free so it can be unit tested.
 */

export type EstimatorInput = {
  locations: number;
  coversPerNight: number;
  averageTicket: number;
  /** Assumed ticket lift from self-ordering, in percent (0–30). */
  ticketLiftPercent: number;
};

export type Estimate = {
  monthlyRevenue: number;
  revenueLift: number;
  vendorSavings: number;
  tendCost: number;
  monthlyNet: number;
  annualNet: number;
};

/** Service nights per month assumed by the estimate. */
export const SERVICE_NIGHTS_PER_MONTH = 28;
/** Estimated monthly saving per location from replacing a separate POS, reservations, loyalty and SMS stack. */
export const VENDOR_SAVINGS_PER_LOCATION = 250;

/**
 * Monthly list prices in USD, per location, set by the owner (2026-11-04).
 * From 25 locations pricing is quoted separately, so the estimator stops
 * below that (MAX_ESTIMATOR_LOCATIONS).
 */
export const TEND_PRICING = {
  /** Per location, for 1–4 locations. */
  starterPerLocation: 499,
  /** Per location, for 5–14 locations. */
  growthPerLocation: 449,
  /** Per location, for 15–24 locations. */
  scalePerLocation: 399,
  /** From this many locations, pricing is quoted separately. */
  quoteFromLocations: 25,
} as const;

/** The estimator's largest location count (its slider maximum). */
export const MAX_ESTIMATOR_LOCATIONS = 20;

/** Ticket-lift range reported by the industry research the page cites
    (content/research.ts: "+15–30%"), in percent. */
export const RESEARCH_TICKET_LIFT_RANGE = [15, 30] as const;

export const ESTIMATOR_DEFAULTS: EstimatorInput = {
  locations: 1,
  coversPerNight: 120,
  averageTicket: 48,
  ticketLiftPercent: 15,
};

/** Tend's monthly list price for a number of locations (all at one tier). */
export function tendMonthlyCost(locations: number): number {
  if (locations >= TEND_PRICING.quoteFromLocations) {
    throw new RangeError(
      `${TEND_PRICING.quoteFromLocations} or more locations are quoted separately`,
    );
  }
  if (locations <= 4) return locations * TEND_PRICING.starterPerLocation;
  if (locations <= 14) return locations * TEND_PRICING.growthPerLocation;
  return locations * TEND_PRICING.scalePerLocation;
}

export function estimate(input: EstimatorInput): Estimate {
  const monthlyRevenue =
    input.locations *
    input.coversPerNight *
    input.averageTicket *
    SERVICE_NIGHTS_PER_MONTH;
  const revenueLift = monthlyRevenue * (input.ticketLiftPercent / 100);
  const vendorSavings = input.locations * VENDOR_SAVINGS_PER_LOCATION;
  const tendCost = tendMonthlyCost(input.locations);
  const monthlyNet = revenueLift + vendorSavings - tendCost;
  return {
    monthlyRevenue,
    revenueLift,
    vendorSavings,
    tendCost,
    monthlyNet,
    annualNet: monthlyNet * 12,
  };
}

const MINUS = "−";

/** `$161,280`; negatives as `−$2,988`. */
export function formatCurrency(value: number): string {
  const rounded = Math.round(value);
  const digits = Math.abs(rounded).toLocaleString("en-US");
  return rounded < 0 ? `${MINUS}$${digits}` : `$${digits}`;
}

/** Signed compact amount for the breakdown: `+$24.2k`, `+$250`, `−$499`. */
export function formatSignedCompact(value: number): string {
  const abs = Math.abs(value);
  const body =
    abs >= 1000
      ? `$${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`
      : `$${Math.round(abs)}`;
  return `${value < 0 ? MINUS : "+"}${body}`;
}
