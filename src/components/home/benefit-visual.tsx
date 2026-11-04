import Image, { type StaticImageData } from "next/image";
import { Check, CreditCard, LockKeyhole, Users } from "lucide-react";

import caesarSalad from "@/assets/images/benefits/ui/caesar-salad.webp";
import citrusSpritz from "@/assets/images/benefits/ui/citrus-spritz.webp";
import truffleGnocchi from "@/assets/images/benefits/ui/truffle-gnocchi.webp";
import truffleGnocchiDetail from "@/assets/images/benefits/ui/truffle-gnocchi-detail.webp";

function FoodImage({ src }: { src: StaticImageData }) {
  return (
    <span className="benefit-food">
      <Image src={src} alt="" fill sizes="240px" />
    </span>
  );
}

function MenuVisual() {
  return (
    <div className="benefit-visual benefit-visual--menu">
      <div className="benefit-menu-heading">
        <div>
          <span>DINING AT · TABLE 12</span>
          <strong>Maple &amp; Ash</strong>
        </div>
        <b>12 dishes</b>
      </div>
      <div className="benefit-menu-feature">
        <FoodImage src={truffleGnocchi} />
        <div>
          <span>CHEF&apos;S PICK</span>
          <strong>Truffle gnocchi</strong>
          <small>Brown butter · wild mushrooms · $29</small>
        </div>
      </div>
      <div className="benefit-menu-list">
        <div>
          <FoodImage src={caesarSalad} />
          <span>
            <strong>Garden Caesar</strong>
            <small>Lemon · sourdough</small>
          </span>
          <b>$16</b>
        </div>
        <div>
          <FoodImage src={citrusSpritz} />
          <span>
            <strong>Citrus spritz</strong>
            <small>Zero-proof · rosemary</small>
          </span>
          <b>$14</b>
        </div>
      </div>
    </div>
  );
}

function DetailVisual() {
  return (
    <div className="benefit-visual benefit-visual--detail">
      <FoodImage src={truffleGnocchiDetail} />
      <div className="benefit-detail-card">
        <span>HOUSE FAVORITE</span>
        <div className="benefit-detail-title">
          <strong>Truffle gnocchi</strong>
          <b>$29</b>
        </div>
        <p>Brown butter, wild mushrooms, parmesan and black truffle.</p>
        <div className="benefit-detail-tags">
          <span>Vegetarian</span>
          <span>Contains dairy</span>
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  image,
  name,
  detail,
  price,
}: {
  image: StaticImageData;
  name: string;
  detail: string;
  price: string;
}) {
  return (
    <div className="benefit-order-row">
      <FoodImage src={image} />
      <span>
        <strong>{name}</strong>
        <small>{detail}</small>
      </span>
      <b>{price}</b>
    </div>
  );
}

function OrderVisual() {
  return (
    <div className="benefit-visual benefit-visual--order">
      <div className="benefit-order-heading">
        <div>
          <span>TABLE 12</span>
          <strong>Your order</strong>
        </div>
        <b>NOT SENT</b>
      </div>
      <div className="benefit-order-list">
        <OrderRow
          image={truffleGnocchi}
          name="Truffle gnocchi"
          detail="1 · No changes"
          price="$29"
        />
        <OrderRow
          image={citrusSpritz}
          name="Citrus spritz"
          detail="1 · Zero-proof"
          price="$14"
        />
        <OrderRow
          image={caesarSalad}
          name="Garden Caesar"
          detail="1 · Dressing on side"
          price="$16"
        />
      </div>
      <div className="benefit-order-total">
        <span>3 items</span>
        <strong>Total</strong>
        <b>$63.72</b>
      </div>
    </div>
  );
}

function PayVisual() {
  return (
    <div className="benefit-visual benefit-visual--pay">
      <div className="benefit-pay-total">
        <span>
          <LockKeyhole size={13} /> AMOUNT DUE
        </span>
        <strong>$71.37</strong>
        <small>3 items · tax and gratuity included</small>
        <div className="benefit-pay-thumbs">
          <FoodImage src={truffleGnocchi} />
          <FoodImage src={citrusSpritz} />
          <FoodImage src={caesarSalad} />
        </div>
      </div>
      <div className="benefit-pay-controls">
        <div className="benefit-tip-row">
          <span>15%</span>
          <span className="is-selected">18%</span>
          <span>20%</span>
          <span>Other</span>
        </div>
        <div className="benefit-pay-option">
          <Users size={16} />
          <span>
            <strong>Split the bill</strong>
            <small>Evenly or by item</small>
          </span>
          <b>›</b>
        </div>
        <div className="benefit-pay-option">
          <CreditCard size={16} />
          <span>
            <strong>Visa ···· 4821</strong>
            <small>Ready to pay</small>
          </span>
          <Check size={15} />
        </div>
      </div>
    </div>
  );
}

/** Illustrations by the Tend app screen each one depicts. */
const VISUALS = {
  "02-menu": MenuVisual,
  "03-item-detail": DetailVisual,
  "04-cart": OrderVisual,
  "06-pay-bill": PayVisual,
} as const;

export type BenefitScreen = keyof typeof VISUALS;

/** An integrated bento illustration with no phone or device chrome. */
export function BenefitVisual({ screen }: { screen: BenefitScreen }) {
  const Visual = VISUALS[screen];
  return (
    <div className="benefit-visual-wrap" aria-hidden="true">
      <Visual />
    </div>
  );
}
