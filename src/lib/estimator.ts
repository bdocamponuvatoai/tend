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

/** Monthly list prices used by the estimate, in USD. */
export const TEND_PRICING = {
  singleLocation: 499,
  /** Per location, for 2–14 locations. */
  growthPerLocation: 399,
  /** Per location, for 15 or more locations. */
  scalePerLocation: 299,
} as const;

export const ESTIMATOR_DEFAULTS: EstimatorInput = {
  locations: 1,
  coversPerNight: 120,
  averageTicket: 48,
  ticketLiftPercent: 15,
};

export function tendMonthlyCost(locations: number): number {
  if (locations === 1) return TEND_PRICING.singleLocation;
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
